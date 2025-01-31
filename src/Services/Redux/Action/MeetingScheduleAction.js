import { axiosClient } from "../../Axios/Axios";
const token = localStorage.getItem("token");

export const getMeetingSchedule = (status) => async (dispatch) => {
  const user_id = localStorage.getItem("userId");
  try {
    dispatch({ type: "MEETING_SCHEDULE_LOADING" });
    const { data } = await axiosClient.get(
      `/getall/meetings?id=${user_id}&status=${status}`
    );
    dispatch({ type: "GET_MEETING_SCHEDULE", payload: data.data });
  } catch (error) {
    console.error(error);
    dispatch({ type: "MEETING_SCHEDULE_ERROR", payload: error.message });
  }
};

export const createMeetingSchedule = (meetingData) => async (dispatch) => {
  const companyId = localStorage.getItem("companyId");
  const user_id = localStorage.getItem("userId");
  try {
    dispatch({ type: "MEETING_SCHEDULE_LOADING" });
    const { data } = await axiosClient.post(
      "/create/meeting",
      {
        status: 0,
        user_id: user_id,
        company_id: companyId,
        project_id:
          meetingData.selectedProjectId == ""
            ? null
            : meetingData.selectedProjectId,
        agenda: meetingData.agenda,
        start_time: meetingData.startTime,
        end_time: meetingData.endTime,
        date: meetingData.date.toISOString(),
        team_members: meetingData.teamMembers,
        description: meetingData.description,
        manager_id: meetingData.teamManager,
      },
      {
        headers: {
          token: token,
        },
      }
    );

    dispatch({ type: "CREATE_MEETING_SCHEDULE", payload: data.data });

    return {
      success: true,
      data: data.data,
    };
  } catch (error) {
    console.error(error);
    dispatch({ type: "MEETING_SCHEDULE_ERROR", payload: error.message });
    return {
      success: false,
      error: error.message,
    };
  }
};

export const meetingScheduleUpdateRequest = (id, meetindData) => async (
  dispatch
) => {
  try {
    dispatch({ type: "MEETING_SCHEDULE_LOADING" });
    const { data } = await axiosClient.put(
      `/update/meeting?id=${id}`,
      meetindData
    );
    return data;
  } catch (error) {
    console.error(error);
    dispatch({ type: "MEETING_SCHEDULE_ERROR", payload: error.message });
  }
};
