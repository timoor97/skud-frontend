'use client'
import React from 'react'

const error = ({
}: {
  error: Error & { digest?: string }
  reset: () => void
}) => {


  return (
    <div>404 Page not found</div>
  )
}

export default error