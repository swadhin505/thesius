import { Switch } from '@headlessui/react'

interface CompelexitySwitchProps {
  enabled: boolean
  setEnabled: (enabled: boolean) => void
}

export default function CompelexitySwitch({ enabled, setEnabled }: CompelexitySwitchProps) {
  return (
    <Switch
      checked={enabled}
      onChange={setEnabled}
      className={`${
        enabled ? 'bg-green-600' : 'bg-gray-200'
      } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2`}
    >
      <span className="sr-only">Advanced mode</span>
      <span
        className={`${
          enabled ? 'translate-x-6' : 'translate-x-1'
        } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
      />
    </Switch>
  )
}