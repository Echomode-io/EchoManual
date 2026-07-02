---
layout: page
---

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vitepress'

onMounted(() => {
  const router = useRouter()
  router.go('/manual/')
})
</script>

<meta http-equiv="refresh" content="0;url=/manual/">
