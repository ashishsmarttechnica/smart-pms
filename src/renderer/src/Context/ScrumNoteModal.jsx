import React from 'react'
import { Button, Modal } from 'rsuite'
import { openLinkInBrowser } from './../utils/openLinkInBrowser'

const ScrumNoteModal = ({ open, setOpen, date }) => {
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const handleRefresh = () => {
    window.location.reload()
  }

  return (
    <>
      <Modal backdrop="static" role="alertdialog" open={open} size="full">
        <Modal.Body className="text-center">
          {/* Conditional message depending on whether the ScrumNote is missing */}
          <div>
            <h3 className="text-2xl font-bold">
              {/* Check conditionally whether the ScrumNote is missing */}
              You haven't added the ScrumNote for yesterday. Please update it to proceed.
            </h3>
          </div>

          {/* Button for opening the external link */}
          <div className="mt-10">
            <Button
              onClick={() => {
                openLinkInBrowser('https://pms.smarttechnica.com/#/dashboard')
              }}
              appearance="ghost"
            >
              Open Link in Browser
            </Button>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="mt-5">
            <Button onClick={handleRefresh} color="red" appearance="primary">
              Refresh Page
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default ScrumNoteModal
