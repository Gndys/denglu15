<script setup lang="ts">
import { authClientVue } from "@libs/auth/authClient"
 
const session = authClientVue.useSession()
</script>
 
<template>
  <div class="container mx-auto p-6">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold mb-6">Dashboard</h1>
      
      <!-- Loading state -->
      <div v-if="session.isPending" class="flex items-center justify-center p-8">
        <div class="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        <span class="ml-2 text-muted-foreground">Loading...</span>
      </div>
      
      <!-- Authenticated state -->
      <div v-else-if="session.data?.user" class="space-y-6">
        <div class="bg-card p-6 rounded-lg border">
          <h2 class="text-xl font-semibold mb-4">Welcome back!</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="text-sm font-medium text-muted-foreground">Name</label>
              <p class="text-lg">{{ session.data.user.name || 'Not set' }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-muted-foreground">Email</label>
              <p class="text-lg">{{ session.data.user.email }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-muted-foreground">Email Verified</label>
              <p class="text-lg">{{ session.data.user.emailVerified ? 'Yes' : 'No' }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-muted-foreground">Role</label>
              <p class="text-lg">{{ session.data.user.role || 'User' }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-card p-6 rounded-lg border">
          <h3 class="text-lg font-semibold mb-4">Actions</h3>
          <div class="flex gap-4">
            <button 
              @click="authClientVue.signOut()"
              class="px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>

        <!-- Debug info -->
        <details class="bg-muted p-4 rounded-lg">
          <summary class="cursor-pointer text-sm font-medium">Debug Info</summary>
          <pre class="mt-4 text-xs overflow-auto">{{ JSON.stringify(session.data, null, 2) }}</pre>
        </details>
      </div>
      
      <!-- Unauthenticated state -->
      <div v-else class="text-center p-8">
        <h2 class="text-xl font-semibold mb-4">Please sign in to continue</h2>
        <NuxtLink to="/signin" class="inline-flex px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
          Sign In
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
