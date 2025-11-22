import { useState } from 'react'
import { toast } from 'react-hot-toast'

export default function ActionsTab() {
  const [isRechecking, setIsRechecking] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)

  const handleRecheck = async () => {
    setIsRechecking(true)
    try {
      const response = await fetch('/api/trigger-recheck', { method: 'POST' })
      if (response.ok) {
        toast.success('Successfully triggered re-check!')
      } else {
        toast.error('Failed to trigger re-check.')
      }
    } catch (error) {
      toast.error('An error occurred while triggering re-check.')
    } finally {
      setIsRechecking(false)
    }
  }

  const handleSync = async () => {
    setIsSyncing(true)
    try {
      const response = await fetch('/api/trigger-sync', { method: 'POST' })
      if (response.ok) {
        toast.success('Successfully triggered full sync!')
      } else {
        toast.error('Failed to trigger full sync.')
      }
    } catch (error) {
      toast.error('An error occurred while triggering full sync.')
    } finally {
      setIsSyncing(false)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <button
          onClick={handleRecheck}
          disabled={isRechecking}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          {isRechecking ? 'Loading...' : 'Run Re-check'}
        </button>
      </div>
      <div>
        <button
          onClick={handleSync}
          disabled={isSyncing}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          {isSyncing ? 'Loading...' : 'Full Sync'}
        </button>
      </div>
    </div>
  )
}
