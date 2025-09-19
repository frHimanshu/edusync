"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Calendar, Clock, MapPin, BookOpen, Plus, Edit, Trash2, Users } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

interface TimetableEntry {
  id: string
  subject_id: string
  subject_name: string
  subject_code: string
  day_of_week: number
  start_time: string
  end_time: string
  room_number: string
  class_type: string
  created_at: string
}

interface Subject {
  id: string
  name: string
  code: string
  semester: number
  department_name: string
}

const DAYS = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
]

const TIME_SLOTS = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30"
]

const CLASS_TYPES = [
  "Lecture", "Tutorial", "Lab", "Seminar", "Workshop"
]

export default function FacultyTimetable() {
  const { user } = useAuth()
  const [timetable, setTimetable] = useState<TimetableEntry[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)
  const [createOpen, setCreateOpen] = useState(false)
  const [editingEntry, setEditingEntry] = useState<TimetableEntry | null>(null)
  const [selectedWeek, setSelectedWeek] = useState(0) // 0 = current week

  // Form state
  const [selectedSubject, setSelectedSubject] = useState("")
  const [dayOfWeek, setDayOfWeek] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [roomNumber, setRoomNumber] = useState("")
  const [classType, setClassType] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return

      try {
        const supabase = createClient()

        // Fetch subjects taught by this faculty
        const { data: subjectsData, error: subjectsError } = await supabase
          .from("subjects")
          .select(`
            *,
            departments(name)
          `)
          .eq("faculty_id", user.id)

        if (subjectsError) {
          console.error("Error fetching subjects:", subjectsError)
          return
        }

        if (subjectsData) {
          const formattedSubjects = subjectsData.map(subject => ({
            id: subject.id,
            name: subject.name,
            code: subject.code,
            semester: subject.semester,
            department_name: subject.departments?.name || "Unknown"
          }))
          setSubjects(formattedSubjects)
        }

        // Fetch timetable entries
        const { data: timetableData, error: timetableError } = await supabase
          .from("timetable")
          .select(`
            *,
            subjects(name, code)
          `)
          .eq("faculty_id", user.id)
          .order("day_of_week")
          .order("start_time")

        if (timetableError) {
          console.error("Error fetching timetable:", timetableError)
          return
        }

        if (timetableData) {
          const formattedTimetable = timetableData.map(entry => ({
            id: entry.id,
            subject_id: entry.subject_id,
            subject_name: entry.subjects?.name || "Unknown",
            subject_code: entry.subjects?.code || "",
            day_of_week: entry.day_of_week,
            start_time: entry.start_time,
            end_time: entry.end_time,
            room_number: entry.room_number,
            class_type: entry.class_type || "Lecture",
            created_at: entry.created_at
          }))
          setTimetable(formattedTimetable)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        toast.error("Failed to load timetable data")
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchData()
    }
  }, [user])

  const handleCreateEntry = async () => {
    if (!user || !selectedSubject || !dayOfWeek || !startTime || !endTime || !roomNumber) {
      toast.error("Please fill in all required fields")
      return
    }

    setSubmitting(true)

    try {
      const supabase = createClient()

      const { error } = await supabase
        .from("timetable")
        .insert({
          subject_id: selectedSubject,
          faculty_id: user.id,
          day_of_week: parseInt(dayOfWeek),
          start_time: startTime,
          end_time: endTime,
          room_number: roomNumber,
          class_type: classType || "Lecture"
        })

      if (error) {
        throw error
      }

      toast.success("Timetable entry created successfully")
      setCreateOpen(false)
      resetForm()
      
      // Refresh timetable
      window.location.reload()
    } catch (error) {
      console.error("Error creating timetable entry:", error)
      toast.error("Failed to create timetable entry")
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditEntry = async () => {
    if (!editingEntry || !selectedSubject || !dayOfWeek || !startTime || !endTime || !roomNumber) {
      toast.error("Please fill in all required fields")
      return
    }

    setSubmitting(true)

    try {
      const supabase = createClient()

      const { error } = await supabase
        .from("timetable")
        .update({
          subject_id: selectedSubject,
          day_of_week: parseInt(dayOfWeek),
          start_time: startTime,
          end_time: endTime,
          room_number: roomNumber,
          class_type: classType || "Lecture"
        })
        .eq("id", editingEntry.id)

      if (error) {
        throw error
      }

      toast.success("Timetable entry updated successfully")
      setEditingEntry(null)
      resetForm()
      
      // Refresh timetable
      window.location.reload()
    } catch (error) {
      console.error("Error updating timetable entry:", error)
      toast.error("Failed to update timetable entry")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteEntry = async (entryId: string) => {
    if (!confirm("Are you sure you want to delete this timetable entry?")) {
      return
    }

    try {
      const supabase = createClient()

      const { error } = await supabase
        .from("timetable")
        .delete()
        .eq("id", entryId)

      if (error) {
        throw error
      }

      toast.success("Timetable entry deleted successfully")
      window.location.reload()
    } catch (error) {
      console.error("Error deleting timetable entry:", error)
      toast.error("Failed to delete timetable entry")
    }
  }

  const resetForm = () => {
    setSelectedSubject("")
    setDayOfWeek("")
    setStartTime("")
    setEndTime("")
    setRoomNumber("")
    setClassType("")
  }

  const openEditDialog = (entry: TimetableEntry) => {
    setEditingEntry(entry)
    setSelectedSubject(entry.subject_id)
    setDayOfWeek(entry.day_of_week.toString())
    setStartTime(entry.start_time)
    setEndTime(entry.end_time)
    setRoomNumber(entry.room_number)
    setClassType(entry.class_type)
  }

  const formatTime = (timeString: string) => {
    const time = new Date(`1970-01-01T${timeString}`)
    return time.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  const getTimetableForDay = (dayIndex: number) => {
    return timetable.filter(entry => entry.day_of_week === dayIndex)
  }

  const getClassTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "lecture":
        return "bg-blue-100 text-blue-800"
      case "tutorial":
        return "bg-green-100 text-green-800"
      case "lab":
        return "bg-purple-100 text-purple-800"
      case "seminar":
        return "bg-orange-100 text-orange-800"
      case "workshop":
        return "bg-pink-100 text-pink-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Timetable</h1>
          <p className="text-gray-600">Manage your class schedule and timetable</p>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="mr-2 h-4 w-4" />
              Add Class
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Timetable Entry</DialogTitle>
              <DialogDescription>
                Schedule a new class in your timetable
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="subject">Subject *</Label>
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.id}>
                        {subject.name} ({subject.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="day">Day *</Label>
                  <Select value={dayOfWeek} onValueChange={setDayOfWeek}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select day" />
                    </SelectTrigger>
                    <SelectContent>
                      {DAYS.map((day, index) => (
                        <SelectItem key={index} value={index.toString()}>
                          {day}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="classType">Class Type</Label>
                  <Select value={classType} onValueChange={setClassType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {CLASS_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startTime">Start Time *</Label>
                  <Select value={startTime} onValueChange={setStartTime}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select start time" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_SLOTS.map((time) => (
                        <SelectItem key={time} value={time}>
                          {formatTime(time)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="endTime">End Time *</Label>
                  <Select value={endTime} onValueChange={setEndTime}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select end time" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_SLOTS.map((time) => (
                        <SelectItem key={time} value={time}>
                          {formatTime(time)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="room">Room Number *</Label>
                <Input
                  id="room"
                  placeholder="e.g., A101, Lab-1"
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setCreateOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateEntry}
                  disabled={submitting}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {submitting ? "Creating..." : "Create Entry"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Weekly View */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            Weekly Schedule
          </CardTitle>
          <CardDescription>Your classes for the week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-4">
            {DAYS.map((day, dayIndex) => {
              const dayClasses = getTimetableForDay(dayIndex)
              const isToday = new Date().getDay() === dayIndex
              
              return (
                <div key={dayIndex} className="space-y-2">
                  <div className={`text-center font-medium p-2 rounded ${
                    isToday ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {day}
                  </div>
                  <div className="space-y-2 min-h-[200px]">
                    {dayClasses.length > 0 ? (
                      dayClasses.map((entry) => (
                        <div key={entry.id} className="p-3 border rounded-lg bg-white shadow-sm">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <h4 className="font-medium text-sm">{entry.subject_name}</h4>
                              <p className="text-xs text-gray-600">{entry.subject_code}</p>
                            </div>
                            <div className="flex space-x-1">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => openEditDialog(entry)}
                                className="h-6 w-6 p-0"
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteEntry(entry.id)}
                                className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          <div className="space-y-1 text-xs">
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {formatTime(entry.start_time)} - {formatTime(entry.end_time)}
                            </div>
                            <div className="flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {entry.room_number}
                            </div>
                            <Badge className={`text-xs ${getClassTypeColor(entry.class_type)}`}>
                              {entry.class_type}
                            </Badge>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-gray-400 text-xs py-4">
                        No classes
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Today's Classes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="mr-2 h-5 w-5" />
            Today's Classes
          </CardTitle>
          <CardDescription>Your classes for today</CardDescription>
        </CardHeader>
        <CardContent>
          {(() => {
            const today = new Date().getDay()
            const todayClasses = getTimetableForDay(today)
            
            if (todayClasses.length === 0) {
              return (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No classes scheduled for today</p>
                </div>
              )
            }

            return (
              <div className="space-y-4">
                {todayClasses.map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                          <BookOpen className="h-6 w-6 text-green-600" />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium">{entry.subject_name}</h4>
                        <p className="text-sm text-gray-600">{entry.subject_code}</p>
                        <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                          <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {formatTime(entry.start_time)} - {formatTime(entry.end_time)}
                          </span>
                          <span className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {entry.room_number}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getClassTypeColor(entry.class_type)}>
                        {entry.class_type}
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEditDialog(entry)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )
          })()}
        </CardContent>
      </Card>

      {/* Edit Entry Dialog */}
      <Dialog open={!!editingEntry} onOpenChange={() => setEditingEntry(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Timetable Entry</DialogTitle>
            <DialogDescription>
              Update timetable entry information
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="editSubject">Subject *</Label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name} ({subject.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="editDay">Day *</Label>
                <Select value={dayOfWeek} onValueChange={setDayOfWeek}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select day" />
                  </SelectTrigger>
                  <SelectContent>
                    {DAYS.map((day, index) => (
                      <SelectItem key={index} value={index.toString()}>
                        {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="editClassType">Class Type</Label>
                <Select value={classType} onValueChange={setClassType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {CLASS_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="editStartTime">Start Time *</Label>
                <Select value={startTime} onValueChange={setStartTime}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select start time" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIME_SLOTS.map((time) => (
                      <SelectItem key={time} value={time}>
                        {formatTime(time)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="editEndTime">End Time *</Label>
                <Select value={endTime} onValueChange={setEndTime}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select end time" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIME_SLOTS.map((time) => (
                      <SelectItem key={time} value={time}>
                        {formatTime(time)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="editRoom">Room Number *</Label>
              <Input
                id="editRoom"
                placeholder="e.g., A101, Lab-1"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setEditingEntry(null)}>
                Cancel
              </Button>
              <Button 
                onClick={handleEditEntry}
                disabled={submitting}
                className="bg-green-600 hover:bg-green-700"
              >
                {submitting ? "Updating..." : "Update Entry"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
