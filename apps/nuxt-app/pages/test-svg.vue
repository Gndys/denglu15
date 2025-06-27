<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold mb-4">SVG Import Test</h1>
    
    <div class="space-y-4">
      <div class="flex items-center gap-2">
        <GoogleIcon class="h-6 w-6" />
        <span>Google Icon</span>
      </div>
      
      <div class="flex items-center gap-2">
        <GithubIcon class="h-6 w-6" />
        <span>GitHub Icon</span>
      </div>
      
      <div class="flex items-center gap-2">
        <WeChatIcon class="h-6 w-6" />
        <span>WeChat Icon</span>
      </div>
    </div>
    
    <div class="mt-8">
      <h2 class="text-xl font-semibold mb-4">SocialButton Test</h2>
      <div class="space-y-2 max-w-sm">
        <SocialButton provider="google" />
        <SocialButton provider="github" />
        <SocialButton provider="wechat" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 测试直接导入 SVG
import GoogleIcon from '@libs/ui/icons/google.svg'
import GithubIcon from '@libs/ui/icons/github.svg'
import WeChatIcon from '@libs/ui/icons/wechat.svg'
</script> 