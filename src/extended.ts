export type { AddTagVariables, RemoveTagVariables, UnassignVariables, UpdateCommentVariables } from './extended/desk'
export {
    useFrappeAddComment,
    useFrappeAddTag,
    useFrappeAssign,
    useFrappeAssignMultiple,
    useFrappeCloseAssignment,
    useFrappeGetComments,
    useFrappeGetShareUsers,
    useFrappeGetTaggedDocs,
    useFrappeGetTags,
    useFrappeRemoveTag,
    useFrappeShareAdd,
    useFrappeShareSetPermission,
    useFrappeUnassign,
    useFrappeUpdateComment,
} from './extended/desk'
export { frappeExtendedQueryOptions } from './extended/options'
export { useFrappeGetDocPermissions, useFrappeHasPermission } from './extended/permission'
export type { PrepareReportVariables } from './extended/report'
export {
    useFrappeDownloadReport,
    useFrappeGetQueuedReport,
    useFrappeGetReport,
    useFrappeGetReportCount,
    useFrappeGetReportList,
    useFrappeGetReportScript,
    useFrappePrepareReport,
    useFrappeRunReport,
    useFrappeStopReport,
} from './extended/report'
export { useFrappeGetTimeZone } from './extended/site'
export type { ApplyWorkflowVariables, BulkApprovalVariables } from './extended/workflow'
export {
    useFrappeApplyWorkflow,
    useFrappeBulkWorkflowApproval,
    useFrappeCanCancelDocument,
    useFrappeGetCommonTransitionActions,
    useFrappeGetTransitions,
} from './extended/workflow'
export { frappeQueryKeys } from './query/keys'
export { frappeQueryOptions } from './query/options'
