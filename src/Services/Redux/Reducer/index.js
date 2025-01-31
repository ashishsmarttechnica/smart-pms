import { combineReducers } from 'redux'
import { authReducer } from './AuthReducer'
import taskReducer from './TaskReducer'
import taskTimerReducer from './TaskTimerREducer'
import TimeDurationReducer from './TimeDurationReducer'
import projectReducer from './projectReducer'
import TeamUserReducer from './TeamUserReducer'
import TeamManagerReducer from './TeamManagerReducer'
import meetingScheduleReducer from './meetingScheduleReducer'
import singleTaskReducer from './SingleTaskReducer'
import UserAlltimeReducer from './UserAlltimeReducer'
import settingsReducer from './settingsReducer'
import TaskUserReducer from './TaskUserReducer'
import moduleReducer from './moduleReducer'
import userReducer from './UserReducer'
const reducers = combineReducers({
  adminDetail: authReducer,
  usersDetails: userReducer,
  taskList: taskReducer,
  taskTimer: taskTimerReducer,
  projectList: projectReducer,
  TimeDurationReducer: TimeDurationReducer,
  teamUser: TeamUserReducer,
  teamManager: TeamManagerReducer,
  meetingSchedule: meetingScheduleReducer,
  singleTaskData: singleTaskReducer,
  userAllTImeData: UserAlltimeReducer,
  settingDetails: settingsReducer,
  taskUserDetails: TaskUserReducer,
  moduleDetails: moduleReducer
})
export default reducers
