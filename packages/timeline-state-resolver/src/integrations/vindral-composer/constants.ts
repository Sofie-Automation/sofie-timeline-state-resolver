/**
 * Name of the TSR media-player helper function expected in the Composer Script Engine when
 * `useScriptEngine` is enabled. It receives the full desired play-state of a media player and
 * reconciles it atomically (load → wait-for-parse → seek → play). See SCRIPT_ENGINE.md for the
 * payload contract and a reference implementation. Prefixed `tsr` to scope it away from a project's
 * own script functions.
 */
export const TSR_SCRIPT_FN_MEDIA_PLAYER = 'tsrMediaPlayer'
