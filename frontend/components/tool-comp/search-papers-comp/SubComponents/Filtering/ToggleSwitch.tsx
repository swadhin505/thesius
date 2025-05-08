import { Switch } from '@headlessui/react'

interface ToggleSwitchProps {
  enabled: boolean
  setEnabled: (enabled: boolean) => void
}

export default function ToggleSwitch({ enabled, setEnabled }: ToggleSwitchProps) {
  return (
    <Switch
      checked={enabled}
      onChange={setEnabled}
      className={`${
        enabled ? 'bg-green-600' : 'bg-gray-200'
      } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2`}
    >
      <span className="sr-only">Enable open access filter</span>
      <span
        className={`${
          enabled ? 'translate-x-6' : 'translate-x-1'
        } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
      />
    </Switch>
  )
}

