import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'

function Appointments() {
  return (
    <div className="grid grid-cols-4 gap-4">
      {/* main form (3/4) */}
      <div className="col-span-3">
        <Card>
          <Tabs defaultValue="location">
            <TabsList>
              <TabsTrigger value="location">Location</TabsTrigger>
              <TabsTrigger value="dates">Dates</TabsTrigger>
              <TabsTrigger value="car">Car</TabsTrigger>
              <TabsTrigger value="summary">Summary</TabsTrigger>
            </TabsList>

            {/* Tab panels */}
            <TabsContent value="location">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Select Pick-up &amp; Return Locations
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Choose your preferred pick-up and return locations
                </p>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Pick-up Location select */}
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="pickup-location">Pick-up Location</Label>
                  <Select id="pickup-location" defaultValue="">
                    <SelectTrigger>
                      <SelectValue placeholder="Select pick-up location" />
                    </SelectTrigger>
                    <SelectContent>
                      {/* <SelectItem value="...">...</SelectItem> */}
                    </SelectContent>
                  </Select>
                </div>

                {/* Return same location checkbox */}
                <div className="flex items-center space-x-2">
                  <Checkbox id="return-same" defaultChecked />
                  <Label htmlFor="return-same">Return to the same location</Label>
                </div>

                {/* Next button */}
                <div className="text-right">
                  <Button>Next</Button>
                </div>
              </CardContent>
            </TabsContent>

            {/* Additional tabs content */}
            <TabsContent value="dates">
              <CardContent>
                {/* Future date selection */}
              </CardContent>
            </TabsContent>
            <TabsContent value="car">
              <CardContent>
                {/* Future car selection */}
              </CardContent>
            </TabsContent>
            <TabsContent value="summary">
              <CardContent>
                {/* Future summary details */}
              </CardContent>
            </TabsContent>
          </Tabs>
        </Card>
      </div>

      {/* summary sidebar (1/4) */}
      <div className="col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Booking Summary</CardTitle>
          </CardHeader>
          {/* Optionally <CardContent>…future summary details…</CardContent> */}
        </Card>
      </div>
    </div>
  )
}

export default Appointments
