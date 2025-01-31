import React from 'react'
import { Modal, Button, ButtonToolbar, Uploader, Input, Loader } from 'rsuite'
import { MdSend } from 'react-icons/md'

const StopTaskModal = ({
  isModalOpen,
  closeModal,
  handleStopTaskSubmit,
  handleFileChange,
  handleRemoveFile,
  handleTextChange,
  stopTaskFormData,
  stopTaskloading,
  errors,
  activeTaskId
}) => {
  return (
    <Modal
      open={isModalOpen}
      onClose={closeModal}
      size="sm"
      backdrop="static"
      className="custom-modal"
    >
      <Modal.Header>
        <Modal.Title className="modal-title">Stop Task</Modal.Title>
      </Modal.Header>

      {stopTaskloading ? (
        <div className="flex justify-center items-center h-[358px]">
          <Loader size="md" center />
        </div>
      ) : (
        <>
          <Modal.Body>
            <form className="space-y-6 p-1" onSubmit={handleStopTaskSubmit}>
              {/* Uploader Section */}
              <div className="space-y-2">
                <label className="input-label ml-1">
                  Upload Image <span className="text-sm text-gray-500">(image is optional)</span>
                </label>
                {activeTaskId && (
                  <Uploader
                    autoUpload={false}
                    action=" "
                    listType="picture"
                    onChange={handleFileChange}
                    onRemove={handleRemoveFile}
                    accept="image/*,video/*"
                    className="uploader-custom w-full border-dashed border rounded-md p-4 hover:border-primary"
                    draggable
                  />
                )}
                {errors.files && <span className="text-red-500">{errors.files}</span>}
              </div>

              {/* Text Area Section */}
              <div className="space-y-2">
                <label className="input-label ml-1">
                  Add Text <span className="text-red-500">*</span>
                </label>
                <Input
                  as="textarea"
                  rows={4}
                  value={stopTaskFormData.text}
                  onChange={handleTextChange}
                  placeholder="Write something..."
                  className="textarea-custom w-full p-3"
                />
                {errors.text && <span className="text-red-500">{errors.text}</span>}
              </div>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <ButtonToolbar className="footer-buttons">
              <Button
                appearance="primary"
                onClick={handleStopTaskSubmit}
                className="submit-button min-w-[110px]"
                icon={<MdSend />}
                disabled={stopTaskloading}
              >
                {stopTaskloading ? <Loader size="xs" /> : 'Submit'}
              </Button>
              <Button appearance="subtle" onClick={closeModal} className="cancel-button">
                Cancel
              </Button>
            </ButtonToolbar>
          </Modal.Footer>
        </>
      )}
    </Modal>
  )
}

export default StopTaskModal
