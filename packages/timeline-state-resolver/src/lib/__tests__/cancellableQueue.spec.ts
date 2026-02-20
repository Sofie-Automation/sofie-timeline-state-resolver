import { CancellableQueue } from '../cancellableQueue'

describe('CancellableQueue', () => {
	let queue: CancellableQueue

	beforeEach(() => {
		queue = new CancellableQueue()
	})

	afterEach(async () => {
		queue.clear()
		await queue.waitForQueue() // Ensure all actions have completed before starting next test
	})

	describe('Basic functionality', () => {
		test('executes a single action', async () => {
			const mockAction = jest.fn().mockResolvedValue(undefined)

			await queue.add(null, mockAction)

			expect(mockAction).toHaveBeenCalledTimes(1)
		})

		test('executes multiple actions in order', async () => {
			const executionOrder: number[] = []
			const action1 = jest.fn(async () => {
				executionOrder.push(1)
			})
			const action2 = jest.fn(async () => {
				executionOrder.push(2)
			})
			const action3 = jest.fn(async () => {
				executionOrder.push(3)
			})

			const promises = [queue.add(null, action1), queue.add(null, action2), queue.add(null, action3)]

			await Promise.all(promises)

			expect(executionOrder).toEqual([1, 2, 3])
			expect(action1).toHaveBeenCalledTimes(1)
			expect(action2).toHaveBeenCalledTimes(1)
			expect(action3).toHaveBeenCalledTimes(1)
		})

		test('handles action that throws an error', async () => {
			const error = new Error('Test error')
			const action = jest.fn().mockRejectedValue(error)

			await expect(queue.add(null, action)).rejects.toThrow('Test error')
		})
	})

	describe('Cancel group functionality', () => {
		test('cancels previous action with same cancel group', async () => {
			const action1 = jest.fn(() => sleep(10))
			const action2 = jest.fn(() => sleep(10))
			const action3 = jest.fn(() => sleep(10))

			// Add first action with cancel group 'group1'
			const promise1 = queue.add('group1', action1)

			// Add second action with same cancel group before first executes
			const promise2 = queue.add('group1', action2)

			// Add third action with same cancel group before first executes
			const promise3 = queue.add('group1', action3)

			await Promise.all([promise1, promise2, promise3])

			// First action should be execute (since it starts right away)
			expect(action1).toHaveBeenCalledTimes(1)
			// Second action should be cancelled (by the third action)
			expect(action2).not.toHaveBeenCalled()
			// Third action should execute
			expect(action3).toHaveBeenCalledTimes(1)
		})

		test('different cancel groups do not interfere', async () => {
			const execOrder: number[] = []
			const action1 = jest.fn(() => {
				execOrder.push(1)
				sleep(10)
			})
			const action2 = jest.fn(() => {
				execOrder.push(2)
				sleep(10)
			})
			const action3 = jest.fn(() => {
				execOrder.push(3)
				sleep(10)
			})
			const action4 = jest.fn(() => {
				execOrder.push(4)
				sleep(10)
			})
			const action5 = jest.fn(() => {
				execOrder.push(5)
				sleep(10)
			})

			const promise1 = queue.add('group1', action1)
			const promise2 = queue.add('group2', action2)
			const promise3 = queue.add('group1', action3)
			const promise4 = queue.add('group2', action4)
			const promise5 = queue.add('group1', action5)

			await Promise.all([promise1, promise2, promise3, promise4, promise5])

			// First action should be execute (since it starts right away)
			expect(action1).toHaveBeenCalledTimes(1)
			// action2 should not execute, since it is cancelled by action4
			expect(action2).not.toHaveBeenCalled()
			// action3 should not execute, since it is cancelled by action5
			expect(action3).not.toHaveBeenCalled()
			// action4 should execute, since it is the last action in group2
			expect(action4).toHaveBeenCalledTimes(1)
			// action5 should execute, since it is the last action in group1
			expect(action5).toHaveBeenCalledTimes(1)

			expect(execOrder).toEqual([1, 4, 5])
		})

		test('null cancel group always executes', async () => {
			const action1 = jest.fn(() => sleep(10))
			const action2 = jest.fn(() => sleep(10))
			const action3 = jest.fn(() => sleep(10))

			const promise1 = queue.add(null, action1)
			const promise2 = queue.add(null, action2)
			const promise3 = queue.add(null, action3)

			await Promise.all([promise1, promise2, promise3])

			// All actions with null cancel group should execute
			expect(action1).toHaveBeenCalledTimes(1)
			expect(action2).toHaveBeenCalledTimes(1)
			expect(action3).toHaveBeenCalledTimes(1)
		})

		test('mix of null and non-null cancel groups', async () => {
			const action1 = jest.fn(() => sleep(10))
			const action2 = jest.fn(() => sleep(10))
			const action3 = jest.fn(() => sleep(10))
			const action4 = jest.fn(() => sleep(10))
			const action5 = jest.fn(() => sleep(10))
			const action6 = jest.fn(() => sleep(10))

			const promise1 = queue.add('group1', action1)
			const promise2 = queue.add(null, action2)
			const promise3 = queue.add('group1', action3)
			const promise4 = queue.add(null, action4)
			const promise5 = queue.add('group1', action5)
			const promise6 = queue.add(null, action6)

			await Promise.all([promise1, promise2, promise3, promise4, promise5, promise6])

			// First action should be execute (since it starts right away)
			expect(action1).toHaveBeenCalledTimes(1)
			// action2 should execute (null cancel group)
			expect(action2).toHaveBeenCalledTimes(1)
			// action3 should not execute, since it is cancelled by action5 (same cancel group)
			expect(action3).not.toHaveBeenCalled()
			// action4 should execute (null cancel group)
			expect(action4).toHaveBeenCalledTimes(1)
			// action5 should execute, since it is the last action in group1
			expect(action5).toHaveBeenCalledTimes(1)
		})

		test('cancelled action still resolves promise', async () => {
			const action1 = jest.fn(() => sleep(10))
			const action2 = jest.fn(() => sleep(10))

			const promise1 = queue.add('group1', action1)
			const promise2 = queue.add('group1', action2)

			// Both promises should resolve without throwing
			await expect(promise1).resolves.toBeUndefined()
			await expect(promise2).resolves.toBeUndefined()
		})
	})

	describe('Clear functionality', () => {
		test('clears the queue', async () => {
			const action1 = jest.fn(async () => {
				await sleep(50)
			})
			const action2 = jest.fn(() => sleep(10))

			// Add first action and let it start executing
			void queue.add(null, action1)

			// Add second action (should be in queue)
			void queue.add(null, action2)

			// Clear the queue
			queue.clear()

			// Wait a bit to ensure nothing executes
			await sleep(20)

			// Second action should not execute (was cleared from queue)
			expect(action2).not.toHaveBeenCalled()
		})

		test('clears scheduled actions', async () => {
			const action1 = jest.fn(() => sleep(10))
			const action2 = jest.fn(() => sleep(10))

			queue.add('group1', action1)
			queue.add('group1', action2)
			queue.clear()

			await queue.waitForQueue()

			// action1 should have been called, since it starts executing immediately
			expect(action1).toHaveBeenCalledTimes(1)
			// action2 should be cancelled by the clear
			expect(action2).not.toHaveBeenCalled()
		})
	})

	describe('Edge cases', () => {
		test('handles empty cancel group string', async () => {
			const action1 = jest.fn(() => sleep(10))
			const action2 = jest.fn(() => sleep(10))
			const action3 = jest.fn(() => sleep(10))

			const promise1 = queue.add('', action1)
			const promise2 = queue.add('', action2)
			const promise3 = queue.add('', action3)

			await Promise.all([promise1, promise2, promise3])

			// action1 should have been called, since it starts executing immediately
			expect(action1).toHaveBeenCalledTimes(1)
			// Empty string is treated as a cancel group
			expect(action2).not.toHaveBeenCalled()
			expect(action3).toHaveBeenCalledTimes(1)
		})

		test('handles concurrent execution', async () => {
			const executionOrder: number[] = []
			const actions = Array.from({ length: 10 }, (_, i) =>
				jest.fn(async () => {
					executionOrder.push(i)
					await sleep(Math.random() * 20)
				})
			)

			const promises = actions.map(async (action, i) => queue.add(`group${i}`, action))

			await Promise.all(promises)

			// All actions should execute in order
			expect(executionOrder).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
			for (const action of actions) {
				expect(action).toHaveBeenCalledTimes(1)
			}
		})
	})
})
async function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms))
}
