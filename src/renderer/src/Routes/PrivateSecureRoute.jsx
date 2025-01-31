import { useContext, useEffect, useRef, useState } from 'react';
import { Outlet, Navigate, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { url } from '../../../url';
import ActiveTabContext from '../Context/ActiveTabContext';
import { useDispatch } from 'react-redux';
import { getAdminDetails } from '../../../Services/Redux/Action/AuthAction';
import ScrumNoteModal from '../Context/ScrumNoteModal';
import { getSettingsDetails } from '../../../Services/Redux/Action/settingsAction';
import { toast } from 'react-toastify';
import { getSingleUser } from '../../../Services/Redux/Action/UserAction';

const PrivateSecureRoutes = () => {
  const auth = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const socketRef = useRef(null); // Socket reference
  const { setSocketCount, setPermissions } = useContext(ActiveTabContext); // Context values
  const [scrumNote, setScrumNote] = useState(false); // ScrumNote modal state
  const [currentDate, setCurrentDate] = useState(); // Current date for ScrumNote

  // Function to handle task notifications
  const taskNotificationHandle = async (notificationData) => {
    try {
      if (window.electron) {
        await window.electron.invoke('task-notification', notificationData);
      } else {
        console.error('Electron API is not available');
      }
    } catch (error) {
      console.error('Error handling task notification:', error);
    }
  };

  // Establish socket connection and listen for updates
  useEffect(() => {
    if (!socketRef.current && userId) {
      socketRef.current = io(`${url}/user?id=${userId}`, {
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      // Socket event listeners
      socketRef.current.on('connect', () => {
        console.log('Socket connected successfully');
      });

      socketRef.current.on('connect_error', (error) => {
        console.error('Socket Connection Error:', error);
      });

      socketRef.current.on('statusUpdated', (data) => {
        if (data) {
          setSocketCount(data); // Update context
          taskNotificationHandle({ ...data, role: localStorage.getItem('role') }); // Handle notifications
        }
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect(); // Disconnect socket on cleanup
        socketRef.current = null;
      }
    };
  }, [userId, setSocketCount]);

  // Fetch user details, permissions, and settings
  useEffect(() => {
    if (auth) {
      // Fetch single user details
      dispatch(getSingleUser())
        .then((res) => {
          if (res.success) {
            setPermissions(res.data.app_permission); // Set permissions in context
          } else {
            toast.error('Failed to fetch user details');
          }
        })
        .catch((error) => console.error('Error fetching user details:', error));

      // Fetch admin details
      dispatch(getAdminDetails(auth))
        .then((res) => {
          if (res?.data?.scrumnoteData === false) {
            setScrumNote(true); // Show ScrumNote modal
            setCurrentDate(res.data.date); // Set current date for ScrumNote
          }
          if (!res.success) {
            localStorage.clear(); // Clear storage on authentication failure
            navigate('/'); // Redirect to login
          }
        })
        .catch((error) => {
          console.error('Error fetching admin details:', error);
          localStorage.clear();
          navigate('/');
        });

      // Fetch settings details
      dispatch(getSettingsDetails())
        .catch((error) => console.error('Error fetching settings:', error));
    }
  }, [auth, dispatch, navigate, setPermissions]);

  // Render authenticated routes or redirect to login
  return auth ? (
    <>
      <Outlet /> {/* Render child routes */}
      <ScrumNoteModal open={scrumNote} setOpen={setScrumNote} date={currentDate} />
    </>
  ) : (
    <Navigate to="/" />
  );
};

export default PrivateSecureRoutes;
