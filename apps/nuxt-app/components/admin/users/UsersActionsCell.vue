<script setup lang="ts">
import { ref } from 'vue'
import { MoreHorizontal, Edit, Trash2, User, Ban, UserCheck } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { authClientVue } from '@libs/auth/authClient'
import { toast } from 'vue-sonner'

interface User {
  id: string
  name: string | null
  email: string
  role: string
  emailVerified: boolean
  banned: boolean | null
  createdAt: string | Date
  updatedAt: string | Date
}

defineProps<{
  user: User
}>()

const { t } = useI18n()
const banDialogOpen = ref(false)
const deleteDialogOpen = ref(false)
// Handle ban/unban user
const handleToggleBan = async (user: User) => {
  try {
    if (user.banned) {
      // Unban user
      await authClientVue.admin.unbanUser({
        userId: user.id,
      })
      toast.success(t('admin.users.table.dialog.unbanSuccess'))
    } else {
      // Ban user
      await authClientVue.admin.banUser({
        userId: user.id,
        banReason: 'Banned by admin',
      })
      toast.success(t('admin.users.table.dialog.banSuccess'))
    }
    
    // Refresh the page to update the table data
    //window.location.reload()
    
  } catch (error) {
    console.error('Error toggling ban status:', error)
    toast.error(t('admin.users.messages.operationFailed'))
  }
}

// Handle delete user
const handleDeleteUser = async (user: User) => {
  try {
    await authClientVue.admin.removeUser({
      userId: user.id,
    })
    
    toast.success(t('admin.users.messages.deleteSuccess'))
    
    // Refresh the page to update the table data
    // window.location.reload()
    
  } catch (error) {
    console.error('Error deleting user:', error)
    toast.error(t('admin.users.messages.deleteError'))
  }
}
</script>

<template>
  <div>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" class="w-8 h-8 p-0">
        <span class="sr-only">Open menu</span>
        <MoreHorizontal class="w-4 h-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <!-- View user profile -->
      <DropdownMenuItem @click="navigateTo(`/admin/users/${user.id}`)">
        <User class="mr-2 h-4 w-4" />
        <span>View profile</span>
      </DropdownMenuItem>
      
      <!-- Edit user -->
      <DropdownMenuItem @click="navigateTo(`/admin/users/${user.id}`)">
        <Edit class="mr-2 h-4 w-4" />
        <span>{{ t('admin.users.table.actions.editUser') }}</span>
      </DropdownMenuItem>
      <DropdownMenuItem  @click="banDialogOpen = true">
        <UserCheck v-if="user.banned" class="mr-2 h-4 w-4" />
        <Ban v-else class="mr-2 h-4 w-4" />
        <span>{{ user.banned ? t('admin.users.actions.unbanUser') : t('admin.users.actions.banUser') }}</span>
      </DropdownMenuItem>
      
      <DropdownMenuSeparator />
      <DropdownMenuItem @click="deleteDialogOpen = true" class="text-destructive">
        <Trash2 class="mr-2 h-4 w-4" />
        <span>{{ t('admin.users.table.actions.deleteUser') }}</span>
      </DropdownMenuItem>

    </DropdownMenuContent>
  </DropdownMenu>
  <!-- Toggle ban status with AlertDialog -->
  <AlertDialog v-model:open="banDialogOpen">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>
          {{ user.banned ? t('admin.users.unbanDialog.title') : t('admin.users.banDialog.title') }}
        </AlertDialogTitle>
        <AlertDialogDescription>
          {{ user.banned 
            ? t('admin.users.unbanDialog.description', { userName: user.name || user.email })
            : t('admin.users.banDialog.description', { userName: user.name || user.email })
          }}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>{{ t('actions.cancel') }}</AlertDialogCancel>
        <AlertDialogAction @click="handleToggleBan(user)">
          {{ user.banned ? t('admin.users.actions.unbanUser') : t('admin.users.actions.banUser') }}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
  <!-- Delete user with AlertDialog -->
  <AlertDialog v-model:open="deleteDialogOpen">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{{ t('admin.users.deleteDialog.title') }}</AlertDialogTitle>
        <AlertDialogDescription>
          {{ t('admin.users.deleteDialog.description', { userName: user.name || user.email }) }}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>{{ t('actions.cancel') }}</AlertDialogCancel>
        <AlertDialogAction class="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          @click="handleDeleteUser(user)"
        >
          {{ t('admin.users.table.actions.deleteUser') }}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</div>
</template> 