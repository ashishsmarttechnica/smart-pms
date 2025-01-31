import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Drawer, Input, Modal, Tooltip, Whisper } from "rsuite";
import {
  getMeetingSchedule,
  meetingScheduleUpdateRequest,
} from "../../../../../../Services/Redux/Action/MeetingScheduleAction";
import { url } from "../../../../../../url";
import MeetingSkeleton from "./MeetingSkeleton";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const ApprovedDrawer = ({
  requestDrawerOpen,
  setRequestDrawerOpen,
  requestStatus,
}) => {
  // Redux state for meetings and loading status
  const { meetingSchedule, loading } = useSelector(
    (state) => state.meetingSchedule
  );

  const [modalSingleData, setModalSingleData] = useState({}); // Stores data for the selected meeting to complete
  const [isModalOpen, setIsModalOpen] = useState(false); // Controls the modal visibility
  const [conclusion, setConclusion] = useState(""); // Stores text area input for meeting conclusion
  const [error, setError] = useState(""); // Error message for empty conclusion input

  const userId = localStorage.getItem("userId"); // Fetching logged-in user ID from local storage
  const dispatch = useDispatch();

  // Function to handle starting a meeting
  const handleStartMeeting = (id) => {
    if (!localStorage.getItem("meetingStarted")) {
      dispatch(
        meetingScheduleUpdateRequest(id, {
          status: 5,
          startDate: new Date().toUTCString(),
        })
      )
        .then((res) => {
          if (res.success) {
            toast.success("Meeting Started successfully");
            dispatch(getMeetingSchedule(requestStatus)); // Refresh the meeting schedule
            localStorage.setItem("meetingStarted", true);
          } else {
            toast.error("Failed to start the meeting."); // Handle unexpected response without success
          }
        })
        .catch((error) => {
          console.error("Error starting meeting:", error); // Log the error for debugging
          toast.error(
            "An error occurred while starting the meeting. Please try again."
          );
        });
    } else {
      toast.error("Meeting is already in progress");
    }
  };

  // Function to cancel a meeting
  const handleCancelMeeting = (id) => {
    dispatch(
      meetingScheduleUpdateRequest(id, {
        status: 3,
        endDate: new Date().toUTCString(),
      })
    ).then((res) => {
      if (res.success) {
        toast.success("Meeting Canceled successfully");
        dispatch(getMeetingSchedule(requestStatus)); // Refresh the meeting schedule
        localStorage.removeItem("meetingStarted");
      }
    });
  };

  // Opens modal to complete the meeting and store selected meeting data
  const handleCompleteMeeting = (val) => {
    setModalSingleData(val);
    setIsModalOpen(true);
  };

  // Handles submission for meeting completion with validation for empty input
  const handleModalSubmit = () => {
    if (!conclusion.trim()) {
      setError("Please provide details before completing the meeting.");
      return;
    }

    dispatch(
      meetingScheduleUpdateRequest(modalSingleData._id, {
        status: 4,
        endDate: new Date().toUTCString(),
        conclusion: conclusion,
      })
    ).then((res) => {
      if (res.success) {
        toast.success("Meeting Completed successfully");
        dispatch(getMeetingSchedule(requestStatus)); // Refresh the meeting schedule
        setIsModalOpen(false); // Close modal
        setConclusion(""); // Reset conclusion input
        setError(""); // Clear error message
        localStorage.removeItem("meetingStarted"); // Clear Meeting status
      }
    });
  };

  // Fetch meeting schedule when the drawer opens
  useEffect(() => {
    if (requestDrawerOpen) {
      dispatch(getMeetingSchedule(requestStatus));
    }
  }, [requestDrawerOpen]);

  return (
    <>
      {/* Drawer for displaying meeting details */}
      <Drawer
        open={requestDrawerOpen}
        onClose={() => setRequestDrawerOpen(false)}
        style={{ zIndex: isModalOpen ? 1000 : 1050 }} // Drawer behind modal if open
      >
        <Drawer.Header className="!py-2">
          <Drawer.Title>Meeting</Drawer.Title>
        </Drawer.Header>
        <Drawer.Body className="!p-4 border-y border-dark">
          <div className="space-y-2">
            {/* Display skeleton loader while data is loading */}
            {loading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7 }}
              >
                <MeetingSkeleton />
              </motion.div>
            ) : (
              meetingSchedule.map((val) => (
                <motion.div
                  key={val._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.7 }}
                  className="bg-white rounded-md shadow-sm overflow-hidden border border-gray-400"
                >
                  <div className="bg-dark p-2 flex justify-between items-center">
                    {/* Team member images with tooltips */}
                    <div className="text-white font-medium text-lg">
                      <div className="flex gap-2">
                        {val.team_members.slice(0, 4).map((user) =>
                          user?.img ? (
                            <Whisper
                              key={user._id}
                              placement="top"
                              trigger="hover"
                              speaker={
                                <Tooltip>
                                  <div className="text-base capitalize">
                                    {user.first_name} {user.last_name}
                                  </div>
                                </Tooltip>
                              }
                            >
                              <img
                                src={`${url}/${user?.img}`}
                                alt="dummy"
                                className="rounded-full w-12 h-12"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = `https://via.placeholder.com/150/`;
                                }}
                              />
                            </Whisper>
                          ) : (
                            <Whisper
                              key={user._id}
                              placement="top"
                              trigger="hover"
                              speaker={
                                <Tooltip>
                                  <div className="text-base capitalize">
                                    {user.first_name} {user.last_name}
                                  </div>
                                </Tooltip>
                              }
                            >
                              <div
                                key={user._id}
                                className="rounded-full w-12 h-12 bg-gray-300 flex items-center justify-center text-dark font-bold text-lg uppercase"
                              >
                                {user.first_name.charAt(0)}
                                {user.last_name.charAt(0)}
                              </div>
                            </Whisper>
                          )
                        )}
                        {val.team_members.length > 4 && (
                          <div className="rounded-full w-12 h-12 bg-gray-300 flex items-center justify-center text-dark font-bold text-lg">
                            +{val.team_members.length - 4}
                          </div>
                        )}
                      </div>
                    </div>
                    {/* Meeting controls */}
                    <div className="flex gap-2">
                      {val.status != 5 &&
                        localStorage.getItem("meetingStarted") != true && (
                          <Button
                            onClick={() => handleStartMeeting(val._id)}
                            className="bg-darkBlue/20 border border-darkBlue text-white px-4 py-1 rounded-md text-base font-medium transition-colors"
                          >
                            Start
                          </Button>
                        )}
                      {val.status == 5 && (
                        <>
                          <button
                            onClick={() => handleCompleteMeeting(val)}
                            className="!bg-green-500 border border-green-600 text-white px-4 py-1 rounded-md text-base font-medium transition-colors"
                          >
                            Complete
                          </button>
                          <button
                            onClick={() => handleCancelMeeting(val._id)}
                            className="!bg-red-500 border border-red-600 text-white px-4 py-1 rounded-md text-base font-medium transition-colors"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  {/* Meeting details */}
                  <div className="p-3">
                    <div className="grid grid-cols-3 gap-2 text-base items-center space-y-0">
                      <p className="text-gray-700 ">
                        <span className="font-semibold">Date :</span>{" "}
                        {new Date(val.date).toLocaleDateString("en-GB")}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-semibold"> Start Time :</span>{" "}
                        {val.start_time}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-semibold"> End Time :</span>{" "}
                        {val.end_time}
                      </p>
                    </div>
                    <p className="text-gray-700 text-base mt-2">
                      <span className="font-semibold">Requester Name :</span>{" "}
                      {val.user_id?.first_name} {val.user_id?.last_name}{" "}
                      {val.user_id?.surname}
                    </p>
                    <p className="text-gray-700 text-base mt-2">
                      <span className="font-semibold">Project Name :</span>{" "}
                      {val.project_id?.name}
                    </p>
                    <p className="text-gray-700 text-base mt-2">
                      <span className="font-semibold">Agenda :</span>{" "}
                      {val.agenda}
                    </p>
                    <p className="text-gray-700 text-base mt-2">
                      <span className="font-semibold">Description :</span>{" "}
                      {val.description}
                    </p>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </Drawer.Body>
      </Drawer>

      {/* Modal for completing the meeting */}
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Modal.Header>
          <Modal.Title>Complete Meeting</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Input
            as="textarea"
            rows={10}
            value={conclusion}
            onChange={(value) => {
              setConclusion(value);
              setError(""); // Clear error when user types
            }}
            placeholder="Enter details about the meeting completion"
            className="w-full"
          />
          <div className="mt-1">
            {error && <span className="text-red-500 ml-1">{error}</span>}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleModalSubmit} appearance="primary">
            Submit
          </Button>
          <Button onClick={() => setIsModalOpen(false)} appearance="subtle">
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ApprovedDrawer;
