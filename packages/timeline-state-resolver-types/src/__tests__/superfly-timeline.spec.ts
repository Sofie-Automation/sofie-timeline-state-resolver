// eslint-disable-next-line node/no-extraneous-import
import * as _ from 'underscore'
// eslint-disable-next-line node/no-extraneous-import
import * as Original from 'superfly-timeline'
import * as Local from '../superfly-timeline'

const LocalEnums = {
	EventType: Local.EventType,
}
const OriginalEnums = {
	EventType: Original.EventType,
}
describe('superfly-timeline', () => {
	test('Enums', () => {
		_.each(LocalEnums as any, (e: any, enumName: string) => {
			const originalEnum = (OriginalEnums as any)[enumName]

			expect(e).toBeTruthy()
			expect(originalEnum).toBeTruthy()

			_.each(e, (value: any, key: string) => {
				expect(value).toEqual(originalEnum[key])
			})
		})
	})
	test('Enumarable types', () => {
		_.each(Local, (type: any, typeName: string) => {
			const originalType = (Original as any)[typeName]
			if (_.isFunction(type)) {
				// eslint-disable-next-line jest/no-conditional-expect
				expect(_.isFunction(originalType)).toBeTruthy()
			} else {
				// eslint-disable-next-line jest/no-conditional-expect
				expect(type).toMatchObject(originalType)
			}
		})
	})
	test('Types', () => {
		function returnType<A>(): A {
			// nothing
			let a: any
			return a
		}
		// Note: these checks are not caught by the test, but by the type-check

		// Check that types are the same:
		const a = [
			// Check that local interfaces matches original:
			(): Original.AllStates => returnType<Local.AllStates>(),
			(): Original.Cap => returnType<Local.Cap>(),
			(): Original.Content => returnType<Local.Content>(),
			(): Original.Duration => returnType<Local.Duration>(),
			(): Original.EventType => returnType<Local.EventType>(),
			(): Original.Expression => returnType<Local.Expression>(),
			(): Original.ExpressionObj => returnType<Local.ExpressionObj>(),
			(): Original.ExpressionOperator => returnType<Local.ExpressionOperator>(),
			(): Original.InnerExpression => returnType<Local.InnerExpression>(),
			(): Original.InstanceBase => returnType<Local.InstanceBase>(),
			(): Original.NextEvent => returnType<Local.NextEvent>(),
			(): Original.ObjectId => returnType<Local.ObjectId>(),
			(): Original.ResolveOptions => returnType<Local.ResolveOptions>(),
			(): Original.ResolvedTimeline => returnType<Local.ResolvedTimeline>(),
			(): Original.ResolvedTimelineObject => returnType<Local.ResolvedTimelineObject>(),
			(): Original.ResolvedTimelineObjectInstance => returnType<Local.ResolvedTimelineObjectInstance>(),
			(): Original.ResolvedTimelineObjectInstanceKeyframe => returnType<Local.ResolvedTimelineObjectInstanceKeyframe>(),
			(): Original.ResolvedTimelineObjects => returnType<Local.ResolvedTimelineObjects>(),
			(): Original.ResolverCache => returnType<Local.ResolverCache>(),
			(): Original.StateInTime => returnType<Local.StateInTime>(),
			(): Original.Time => returnType<Local.Time>(),
			(): Original.TimelineEnable => returnType<Local.TimelineEnable>(),
			(): Original.TimelineKeyframe => returnType<Local.TimelineKeyframe>(),
			(): Original.TimelineObject => returnType<Local.TimelineObject>(),
			(): Original.TimelineObjectInstance => returnType<Local.TimelineObjectInstance>(),
			(): Original.TimelineState => returnType<Local.TimelineState>(),

			// Check that original interfaces matches local
			(): Local.AllStates => returnType<Original.AllStates>(),
			(): Local.Cap => returnType<Original.Cap>(),
			(): Local.Content => returnType<Original.Content>(),
			(): Local.Duration => returnType<Original.Duration>(),
			(): Local.EventType => returnType<Original.EventType>(),
			(): Local.Expression => returnType<Original.Expression>(),
			(): Local.ExpressionObj => returnType<Original.ExpressionObj>(),
			(): Local.ExpressionOperator => returnType<Original.ExpressionOperator>(),
			(): Local.InnerExpression => returnType<Original.InnerExpression>(),
			(): Local.InstanceBase => returnType<Original.InstanceBase>(),
			(): Local.NextEvent => returnType<Original.NextEvent>(),
			(): Local.ObjectId => returnType<Original.ObjectId>(),
			(): Local.ResolveOptions => returnType<Original.ResolveOptions>(),
			(): Local.ResolvedTimeline => returnType<Original.ResolvedTimeline>(),
			(): Local.ResolvedTimelineObject => returnType<Original.ResolvedTimelineObject>(),
			(): Local.ResolvedTimelineObjectInstance => returnType<Original.ResolvedTimelineObjectInstance>(),
			(): Local.ResolvedTimelineObjectInstanceKeyframe => returnType<Original.ResolvedTimelineObjectInstanceKeyframe>(),
			(): Local.ResolvedTimelineObjects => returnType<Original.ResolvedTimelineObjects>(),
			(): Local.ResolverCache => returnType<Original.ResolverCache>(),
			(): Local.StateInTime => returnType<Original.StateInTime>(),
			(): Local.Time => returnType<Original.Time>(),
			(): Local.TimelineEnable => returnType<Original.TimelineEnable>(),
			(): Local.TimelineKeyframe => returnType<Original.TimelineKeyframe>(),
			(): Local.TimelineObject => returnType<Original.TimelineObject>(),
			(): Local.TimelineObjectInstance => returnType<Original.TimelineObjectInstance>(),
			(): Local.TimelineState => returnType<Original.TimelineState>(),
		]
		expect(a).toBeTruthy()

		expect(1).toEqual(1)
	})
})
