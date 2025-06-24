import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, AlertTriangle, Crown, User, UsersIcon, Info } from "lucide-react"
import { getUsersForCurrentAccount, getCurrentUser } from "@/lib/auth-actions"
import { UserEditButton } from "@/components/user-edit-button"

export async function UsersPage() {
  const user = await getCurrentUser()

  if (!user?.activeAccount) {
    return (
      <div className="flex items-center justify-center h-64">
        <Alert className="border-yellow-500/50 bg-yellow-500/10 max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-yellow-400">No active account selected</AlertDescription>
        </Alert>
      </div>
    )
  }

  let users: any[] = []
  let error: string | null = null

  try {
    users = await getUsersForCurrentAccount()
  } catch (err) {
    console.error("Error loading users:", err)
    error = err instanceof Error ? err.message : "Failed to load users"
  }

  return (
    <div className="w-full">
      <Card className="bg-black/20 backdrop-blur-lg border-white/10 shadow-[0_0_15px_rgba(128,0,128,0.5)]">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl text-white flex items-center gap-2">
              <UsersIcon className="h-6 w-6" />
              Account Users
            </CardTitle>
            {!error && users.length > 0 && (
              <Alert className="border-blue-500/50 bg-blue-500/10 mb-4">
                <Info className="h-4 w-4" />
                <AlertDescription className="text-blue-400">
                  <p className="text-sm">
                    <strong>Note:</strong> Individual user management features may be limited due to API access
                    restrictions. User details and attribute editing depend on endpoint availability.
                  </p>
                </AlertDescription>
              </Alert>
            )}
            <p className="text-gray-400 mt-1">
              {error ? "Error loading users" : `${users.length} users`} in{" "}
              <span className="text-purple-300">{user.activeAccount.name}</span>
            </p>
          </div>
          <Button className="bg-purple-600 hover:bg-purple-700 text-white">
            <Plus className="mr-2 h-4 w-4" /> Add User
          </Button>
        </CardHeader>
        <CardContent>
          {error ? (
            <Alert className="border-red-500/50 bg-red-500/10">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-red-400">
                <div>
                  <p className="font-semibold">Failed to load users</p>
                  <p className="text-sm mt-1">{error}</p>
                  <p className="text-xs mt-2 text-gray-400">Check the console for detailed error information.</p>
                </div>
              </AlertDescription>
            </Alert>
          ) : users.length === 0 ? (
            <div className="text-center py-8">
              <UsersIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400 mb-2">No users found in this account</p>
              <p className="text-sm text-gray-500 mb-4">Users need to be added to the account to appear here</p>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                <Plus className="mr-2 h-4 w-4" /> Add First User
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-white/20 hover:bg-white/5">
                  <TableHead className="text-white">User</TableHead>
                  <TableHead className="text-white">Email</TableHead>
                  <TableHead className="text-white">Role</TableHead>
                  <TableHead className="text-white">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user, index) => {
                  // Use the actual attribute names from the API response
                  const firstName = user.attributes?.firstname || "" // Note: 'firstname' not 'first_name'
                  const lastName = user.attributes?.lastname || user.attributes?.surname || "" // Try both 'lastname' and 'surname'
                  const displayName =
                    firstName && lastName
                      ? `${firstName} ${lastName}`.trim()
                      : firstName || lastName || user.attributes?.name || user.identifiers.email_address.split("@")[0]

                  console.log(
                    `[UsersPage] User ${user.user_id} - firstName: "${firstName}", lastName: "${lastName}", displayName: "${displayName}"`,
                  )
                  console.log(
                    `[UsersPage] User ${user.user_id} all attributes:`,
                    JSON.stringify(user.attributes, null, 2),
                  )

                  return (
                    <TableRow key={user.user_id} className="border-white/20 hover:bg-white/5">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="/placeholder.svg" alt="User" />
                            <AvatarFallback>{displayName.charAt(0).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <span className="font-medium text-white">{displayName}</span>
                            {(firstName || lastName) && (
                              <p className="text-xs text-gray-400">
                                {firstName && `First: ${firstName}`} {lastName && `Last: ${lastName}`}
                              </p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-300">{user.identifiers.email_address}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {user.user_type === "owner" ? (
                            <>
                              <Crown className="h-3 w-3 text-yellow-400" />
                              <span className="text-yellow-400 text-sm font-medium">Owner</span>
                            </>
                          ) : (
                            <>
                              <User className="h-3 w-3 text-blue-400" />
                              <span className="text-blue-400 text-sm font-medium">User</span>
                            </>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <UserEditButton
                          userId={user.user_id}
                          userEmail={user.identifiers.email_address}
                          existingAttributes={user.attributes}
                        />
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
