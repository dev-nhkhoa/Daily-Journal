'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

export default function SettingsPage() {
  const router = useRouter()
  const [settings, setSettings] = useState({
    fontStyle: 'sans',
    theme: 'light',
    darkMode: false,
    lineHeight: '1.5',
  })

  useEffect(() => {
    const savedSettings = localStorage.getItem('journalSettings')
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
  }, [])

  const handleSettingChange = (setting: string, value: string | boolean) => {
    const newSettings = { ...settings, [setting]: value }
    setSettings(newSettings)
    localStorage.setItem('journalSettings', JSON.stringify(newSettings))
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <div className="space-y-4">
        <div>
          <Label htmlFor="fontStyle">Font Style</Label>
          <Select
            value={settings.fontStyle}
            onValueChange={(value) => handleSettingChange('fontStyle', value)}
          >
            <SelectTrigger id="fontStyle">
              <SelectValue placeholder="Select font style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sans">Sans-serif</SelectItem>
              <SelectItem value="serif">Serif</SelectItem>
              <SelectItem value="mono">Monospace</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="theme">Theme</Label>
          <Select
            value={settings.theme}
            onValueChange={(value) => handleSettingChange('theme', value)}
          >
            <SelectTrigger id="theme">
              <SelectValue placeholder="Select theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="darkMode"
            checked={settings.darkMode}
            onCheckedChange={(checked) => handleSettingChange('darkMode', checked)}
          />
          <Label htmlFor="darkMode">Dark Mode</Label>
        </div>
        <div>
          <Label htmlFor="lineHeight">Line Height</Label>
          <Input
            id="lineHeight"
            type="number"
            min="1"
            max="2"
            step="0.1"
            value={settings.lineHeight}
            onChange={(e) => handleSettingChange('lineHeight', e.target.value)}
          />
        </div>
        <Button onClick={() => router.push('/')}>Save and Return</Button>
      </div>
    </div>
  )
}

