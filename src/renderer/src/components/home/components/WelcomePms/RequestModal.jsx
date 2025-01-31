import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, DatePicker, Form, Input, Modal, SelectPicker, TagPicker } from 'rsuite'
import {
  getTeamManager,
  getTeamMembers
} from '../../../../../../Services/Redux/Action/TeamUserAction'
import { getUserProjects } from '../../../../../../Services/Redux/Action/ProjectAction'
import { createMeetingSchedule } from '../../../../../../Services/Redux/Action/MeetingScheduleAction'
import { toast } from 'react-toastify'

const RequestModal = ({ openRqModal, hendelRqMoldaClose }) => {
  const dispatch = useDispatch()

  // State Management
  const [searchTerm, setSearchTerm] = useState('')
  const [searchMember, setSearchMember] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm)
  const [formData, setFormData] = useState({
    agenda: '',
    date: new Date(),
    startTime: '',
    endTime: '',
    teamMembers: [],
    teamManager: '',
    description: '',
    selectedProjectId: ''
  })



  const [formErrors, setFormErrors] = useState({})
  const [value, setValue] = useState([]) // For selected team members

  // Fetch team members and projects from Redux state
  const teamMembers = useSelector((state) => state.teamUser.teamMembers || [])
  const teamManager = useSelector((state) => state.teamManager.teamManager || [])

  const { projectList, loading } = useSelector((state) => state.projectList)

  // Input handlers
  const handleInputChange = (value, name) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleProjectChange = (value) => {
    setFormData((prev) => ({ ...prev, selectedProjectId: value }))
    const selectedProject = projectList.find((project) => project._id === value)

    if (selectedProject && selectedProject.project_manager) {
      setFormData((prev) => ({
        ...prev,
        teamManager: selectedProject.project_manager._id
      }))
    } else {
      setFormData((prev) => ({ ...prev, teamManager: '' }))
    }
  }

  const handleTeamManagerSearch = (searchKeyword) => {
    setSearchTerm(searchKeyword)
  }
  const handleTeamMembersSearch = (searchKeyword) => {
    setSearchMember(searchKeyword)
  }

  const handleTeamMembersChange = (selectedValue) => {
    setValue(selectedValue)
    setFormData((prev) => ({ ...prev, teamMembers: selectedValue }))
  }

  const handleTeamManagerChange = (value) => {
    setFormData((prev) => ({ ...prev, teamManager: value }))
  }

  // Form validation
  const validateForm = () => {
    const errors = {}
    if (!formData.date) errors.date = 'Date is required'
    if (!formData.startTime) errors.startTime = 'Start time is required'
    if (!formData.endTime) errors.endTime = 'End time is required'
    if (formData.teamMembers.length === 0)
      errors.teamMembers = 'At least one team member is required'
    if (!formData.teamManager) errors.teamManager = 'Team manager is required'
    if (formData.startTime && formData.endTime && formData.startTime >= formData.endTime) {
      errors.endTime = 'End time must be after start time'
    }
    if (!formData.agenda.trim()) errors.agenda = 'Agenda is required'
    if (!formData.description.trim()) errors.description = 'Description is required'
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Form submission handler
  const handleSubmit = () => {
    if (validateForm()) {
      dispatch(createMeetingSchedule(formData)).then((res) => {
        if (res.success) {
          hendelRqMoldaClose()
          toast.success('Meeting scheduled successfully')
          setFormData({
            agenda: '',
            date: new Date(),
            startTime: '',
            endTime: '',
            teamMembers: [],
            teamManager: '',
            description: '',
            selectedProjectId: ''
          })
          setValue([])
        } else {
          toast.error(res.message)
        }
      })
    }
  }

  // Debouncing for team manager search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 500)
    return () => clearTimeout(delayDebounceFn)
  }, [searchTerm])

  useEffect(() => {
    if (debouncedSearchTerm !== '') {
      dispatch(getTeamManager(debouncedSearchTerm))
    }
  }, [debouncedSearchTerm, dispatch])

  // Initial data fetching
  useEffect(() => {
    dispatch(getTeamMembers(''))
    dispatch(getUserProjects())
    dispatch(getTeamManager(''))
  }, [])

  return (
    <Modal open={openRqModal} onClose={hendelRqMoldaClose} size="lg">
      <Modal.Header>
        <Modal.Title>Schedule Meeting</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form fluid>
          <div className="grid grid-cols-3 gap-2">
            {/* Date */}
            <Form.Group>
              <Form.ControlLabel>
                Date <span className="text-red-500">*</span>
              </Form.ControlLabel>
              <DatePicker
                oneTap
                name="date"
                value={formData.date}
                onChange={(value) => handleInputChange(value, 'date')}
                format="dd-MM-yyyy"
                shouldDisableDate={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                className="w-full"
              />
              {formErrors.date && (
                <Form.HelpText className="text-red-500">{formErrors.date}</Form.HelpText>
              )}
            </Form.Group>

            {/* Start Time */}
            <Form.Group>
              <Form.ControlLabel>
                Start time <span className="text-red-500">*</span>
              </Form.ControlLabel>
              <Input
                name="startTime"
                type="time"
                format="HH:mm"
                value={formData.startTime}
                onChange={(value) => handleInputChange(value, 'startTime')}
              />
              {formErrors.startTime && (
                <Form.HelpText className="text-red-500">{formErrors.startTime}</Form.HelpText>
              )}
            </Form.Group>

            {/* End Time */}
            <Form.Group>
              <Form.ControlLabel>
                End time <span className="text-red-500">*</span>
              </Form.ControlLabel>
              <Input
                name="endTime"
                type="time"
                format="HH:mm"
                value={formData.endTime}
                onChange={(value) => handleInputChange(value, 'endTime')}
              />
              {formErrors.endTime && (
                <Form.HelpText className="text-red-500">{formErrors.endTime}</Form.HelpText>
              )}
            </Form.Group>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {/* Select Project */}
            <Form.Group>
              <Form.ControlLabel>Select Project</Form.ControlLabel>
              <SelectPicker
                name="selectedProjectId"
                data={projectList.map((project) => ({
                  label: project.name,
                  value: project._id
                }))}
                placeholder="Select a project"
                value={formData.selectedProjectId}
                onChange={handleProjectChange}
                block
                searchable
                loading={loading}
              />
              {formErrors.selectedProjectId && (
                <Form.HelpText className="text-red-500">
                  {formErrors.selectedProjectId}
                </Form.HelpText>
              )}
            </Form.Group>

            {/* Select Manager */}
            <Form.Group>
              <Form.ControlLabel>
                Manager <span className="text-red-500">*</span>
              </Form.ControlLabel>
              <SelectPicker
                name="teamManager"
                data={teamManager.map((member) => ({
                  label: member.first_name,
                  value: member._id
                }))}
                placeholder="Select team manager"
                value={formData.teamManager}
                onChange={handleTeamManagerChange}
                onSearch={handleTeamManagerSearch}
                block
                loading={teamManager.loading}
                disabled={!!formData.selectedProjectId}
              />
              {formErrors.teamManager && (
                <Form.HelpText className="text-red-500">{formErrors.teamManager}</Form.HelpText>
              )}
            </Form.Group>

            {/* Select Team Members */}
            <Form.Group>
              <Form.ControlLabel>
                Team Members <span className="text-red-500">*</span>
              </Form.ControlLabel>
              <TagPicker
                data={teamMembers}
                cacheData={value}
                value={value}
                style={{ width: '100%' }}
                labelKey="first_name"
                valueKey="_id"
                onChange={handleTeamMembersChange}
                onSearch={handleTeamMembersSearch}
                block
              />
              {formErrors.teamMembers && (
                <Form.HelpText className="text-red-500">{formErrors.teamMembers}</Form.HelpText>
              )}
            </Form.Group>
          </div>

          {/* Agenda */}
          <Form.Group>
            <Form.ControlLabel>
              Agenda <span className="text-red-500">*</span>
            </Form.ControlLabel>
            <Input
              as="textarea"
              rows={3}
              name="agenda"
              placeholder="Enter meeting agenda here"
              value={formData.agenda}
              onChange={(value) => handleInputChange(value, 'agenda')}
            />
            {formErrors.agenda && (
              <Form.HelpText className="text-red-500">{formErrors.agenda}</Form.HelpText>
            )}
          </Form.Group>

          {/* Description */}
          <Form.Group>
            <Form.ControlLabel>
              Description <span className="text-red-500">*</span>
            </Form.ControlLabel>
            <Input
              as="textarea"
              rows={3}
              name="description"
              placeholder="Meeting description"
              value={formData.description}
              onChange={(value) => handleInputChange(value, 'description')}
            />
            {formErrors.description && (
              <Form.HelpText className="text-red-500">{formErrors.description}</Form.HelpText>
            )}
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={hendelRqMoldaClose} appearance="subtle">
          Close
        </Button>
        <Button onClick={handleSubmit} appearance="primary">
          Schedule
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default RequestModal
