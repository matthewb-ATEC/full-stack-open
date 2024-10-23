import { Box, Button } from '@mui/material'
import { forwardRef, useState, useImperativeHandle } from 'react'

const Togglable = forwardRef(({ buttonLabel, children }, refs) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(refs, () => {
    return {
      toggleVisibility,
    }
  })

  return (
    <Box>
      <Box sx={hideWhenVisible}>
        <Button variant="contained" color="primary" onClick={toggleVisibility}>
          {buttonLabel}
        </Button>
      </Box>
      <Box sx={showWhenVisible}>
        {children}
        <Button variant="outlined" color="secondary" onClick={toggleVisibility}>
          cancel
        </Button>
      </Box>
    </Box>
  )
})

Togglable.displayName = 'Togglable'

export default Togglable
