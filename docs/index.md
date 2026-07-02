---
layout: page
---

<script setup>
import { onMounted } from 'vue'
import { useRouter, useData } from 'vitepress'

onMounted(() => {
  const { site } = useData()
  const base = site.value.base || '/'
  const router = useRouter()
  router.go(`${base}manual/`)
})
</script>

<noscript>
  <meta http-equiv="refresh" content="0;url=/manual/">
</noscript>
