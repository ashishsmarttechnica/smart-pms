import React, { useState } from 'react'
import { Dropdown } from 'rsuite'
import { getUserProjects } from '../../../../../../Services/Redux/Action/ProjectAction'
import { useDispatch, useSelector } from 'react-redux'
import { FaFilter } from 'react-icons/fa'

const renderIconButton = (props, ref, selectedProject) => {
  return (
    <div {...props} ref={ref} className="flex items-center gap-2">
      {selectedProject ? (
        <div className="font-semibold text-sm tracking-wider capitalize border px-2 rounded-sm">
          {selectedProject.name}
        </div>
      ) : (
        <>{/* <div className="font-semibold text-sm text-gray-500">All Projects</div> */}</>
      )}
      <FaFilter size={18} className="font-bold" />
    </div>
  )
}

const ProjectFilter = ({ selectedProject, setSelectedProject }) => {
  const { projectList, loading, error } = useSelector((state) => state.projectList)
  const [projectsFetched, setProjectsFetched] = useState(false) // Track if projects are fetched
  const dispatch = useDispatch()

  // Function to handle project selection
  const handleProjectSelect = (project) => {
    setSelectedProject(project) // Update the state with the selected project
  }

  // Function to handle dropdown open event
  const handleDropdownOpen = () => {
    if (!projectsFetched) {
      dispatch(getUserProjects()) // Fetch projects only if not already fetched
      setProjectsFetched(true) // Mark projects as fetched to prevent duplicate API calls
    }
  }

  return (
    <Dropdown
      placement="leftStart"
      renderToggle={(props, ref) => renderIconButton(props, ref, selectedProject)}
      onOpen={handleDropdownOpen} // Trigger API call when dropdown opens
    >
      {loading ? (
        <div className="p-4 text-center text-sm text-gray-500">Loading...</div>
      ) : error ? (
        <div className="p-4 text-center text-sm text-red-500">Failed to load projects</div>
      ) : (
        <div className="max-h-[200px] overflow-auto cardOverflowStik">
          <Dropdown.Item onClick={() => handleProjectSelect(null)}>Select All</Dropdown.Item>
          {projectList.map((project) => (
            <Dropdown.Item
              key={project.id || project.project_id || project.name}
              onClick={() => handleProjectSelect(project)}
            >
              {project.name}
            </Dropdown.Item>
          ))}
        </div>
      )}
    </Dropdown>
  )
}

export default ProjectFilter
