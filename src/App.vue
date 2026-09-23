<script setup>
import { ref } from 'vue'

const step = ref('envelope') // envelope | invite | selectMovie | selectFood | summary | cry
const isFlying = ref(false)
const choices = ref([])

// 请按照你实际的图片文件名修改这里
const movies = [
  { title: '龙餐馆', img: '/images/movie1.jpg' },
  { title: '敦煌英雄', img: '/images/movie2.jpg' },
  { title: '小猪佩奇', img: '/images/movie3.jpg' },
  { title: '复联4', img: '/images/movie4.jpg' }
]

const foods = [
  { title: '成老灶火锅鸡', img: '/images/food1.jpg' },
  { title: '烤鱼', img: '/images/food2.jpg' },
  { title: '朝鲜族烤肉', img: '/images/food3.jpg' }
]

// 记录选择并打印、上报
const logChoice = (stepName, choice) => {
  const record = { step: stepName, choice, time: new Date().toLocaleString() }
  choices.value.push(record)
  console.log('【用户选择】', record)
  fetch('/api/choice', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(record)
  }).catch(() => {})
}

// 信封递送动画
const startFly = () => {
  if (isFlying.value) return
  isFlying.value = true
  setTimeout(() => {
    step.value = 'invite'
    isFlying.value = false
  }, 1200)
}

// 业务逻辑
const acceptMovie = () => step.value = 'selectMovie'
const rejectMovie = () => { logChoice('邀请', '拒绝看电影'); step.value = 'selectFood' }
const chooseMovie = (title) => { logChoice('选电影', title); step.value = 'summary' }
const dislikeMovies = () => { logChoice('选电影', '都不喜欢'); step.value = 'selectFood' }
const chooseFood = (title) => { logChoice('选餐厅', title); step.value = 'summary' }
const rejectFood = () => { logChoice('选餐厅', '拒绝吃饭'); step.value = 'cry' }
const reset = () => { choices.value = []; step.value = 'envelope' }
</script>

<template>
  <div class="page">

    <!-- 场景1：递信封 -->
    <div v-if="step === 'envelope'" class="envelope-scene">
      <div class="character boy">👦</div>
      <div
        class="envelope"
        :class="{ flying: isFlying }"
        @click="startFly"
      >
        <div class="envelope-body">
          <span class="flap"></span>
          <span class="heart">💌</span>
        </div>
      </div>
      <div class="character girl">👧</div>
      <p class="hint">点击信封，送给 TA</p>
    </div>

    <!-- 场景2：邀请函内容 -->
    <div v-else-if="step === 'invite'" class="card">
      <div class="big-icon">💖</div>
      <h1>一封邀请函</h1>
      <p class="subtitle">嘿，周末有空吗？<br>想约你一起去看场电影～</p>
      <div class="btn-group">
        <button class="btn btn-primary" @click="acceptMovie">好呀，去！</button>
        <button class="btn btn-secondary" @click="rejectMovie">看电影...不要</button>
      </div>
    </div>

    <!-- 场景3：选电影 -->
    <div v-else-if="step === 'selectMovie'" class="card">
      <h2>选一部喜欢的电影 🎬</h2>
      <div class="grid-2">
        <div v-for="m in movies" :key="m.title" class="item-card">
          <img :src="m.img" :alt="m.title">
          <p class="item-title">{{ m.title }}</p>
          <button class="btn btn-select" @click="chooseMovie(m.title)">就这部</button>
        </div>
      </div>
      <button class="btn btn-secondary mt-4" @click="dislikeMovies">不喜欢这些</button>
    </div>

    <!-- 场景4：选餐厅 -->
    <div v-else-if="step === 'selectFood'" class="card">
      <h2>那一起去吃个饭吧 🍽️</h2>
      <div class="grid-2">
        <div v-for="f in foods" :key="f.title" class="item-card">
          <img :src="f.img" :alt="f.title">
          <p class="item-title">{{ f.title }}</p>
          <button class="btn btn-select" @click="chooseFood(f.title)">吃这个</button>
        </div>
      </div>
      <button class="btn btn-secondary mt-4" @click="rejectFood">还是不想去</button>
    </div>

    <!-- 场景5：总结 -->
    <div v-else-if="step === 'summary'" class="card">
      <div class="big-icon">🎉</div>
      <h2>约定达成！</h2>
      <ul class="summary-list">
        <li v-for="(c, i) in choices" :key="i">
          <span>{{ c.time }}</span>
          <strong>{{ c.choice }}</strong>
        </li>
      </ul>
      <button class="btn btn-back" @click="reset">重新邀请</button>
    </div>

    <!-- 场景6：哭诉 -->
    <div v-else-if="step === 'cry'" class="card">
      <div class="big-icon">😢</div>
      <h2>呜呜呜...给个机会嘛</h2>
      <p class="subtitle">明天再约一次？</p>
      <button class="btn btn-primary" @click="reset">再试一次</button>
    </div>

  </div>
</template>

<style>
html, body, #app {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}

* { margin: 0; padding: 0; box-sizing: border-box; }

.page {
  min-height: 100vh;
  height: 100vh; 
  width: 100vw;
  overflow-x: hidden;
  background: linear-gradient(135deg, #ffdde1 0%, #ee9ca7 100%);
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
  overflow: hidden;
}

/* 卡片通用样式 */
.card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 24px;
  padding: 32px 24px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  text-align: center;
  max-width: 720px;
  width: 100%;
  animation: pop 0.4s ease-out;
  backdrop-filter: blur(10px);
}
@keyframes pop {
  from { opacity: 0; transform: scale(0.95) translateY(15px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

h1 { color: #ff4d6d; font-size: 2.4rem; margin-bottom: 8px; }
h2 { color: #ff4d6d; font-size: 1.8rem; margin-bottom: 20px; }
.subtitle { color: #555; font-size: 1.2rem; line-height: 1.6; margin-bottom: 24px; }
.big-icon { font-size: 4rem; margin-bottom: 16px; }

/* 按钮 */
.btn {
  border: none;
  padding: 14px 28px;
  font-size: 1.1rem;
  border-radius: 50px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}
.btn-primary {
  background: #ff4d6d;
  color: #fff;
}
.btn-primary:hover { background: #e63e5e; transform: translateY(-2px); }
.btn-secondary {
  background: #f0f0f0;
  color: #666;
}
.btn-secondary:hover { background: #e0e0e0; }
.btn-select {
  background: #ff9f43;
  color: #fff;
  width: 90%;
  padding: 10px;
  border-radius: 20px;
  font-size: 1rem;
}
.btn-select:hover { background: #ff7f33; }
.btn-back {
  background: transparent;
  color: #888;
  border: 1px solid #ccc;
}
.mt-4 { margin-top: 24px; }
.btn-group { display: flex; gap: 15px; justify-content: center; flex-wrap: wrap; }

/* 2x2 网格 */
.grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-top: 16px;
}
.item-card {
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
  border: 1px solid #f0f0f0;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 15px;
}
.item-card:hover { transform: translateY(-4px); }
.item-card img {
  width: 100%;
  height: 180px;
  object-fit: cover;
}
.item-title {
  font-weight: 700;
  color: #333;
  margin: 12px 0 8px;
  font-size: 1.1rem;
}
/* 第三个餐厅卡片横跨整行 */
.item-card:last-child:nth-child(odd) {
  grid-column: 1 / -1;
}
.item-card:last-child:nth-child(odd) img {
  height: 200px;
}

/* 信封递送场景 */
.envelope-scene {
  width: 100%;
  max-width: 500px;
  height: 60vh;
  min-height: 350px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  position: relative;
}
.character {
  font-size: 5rem;
  line-height: 1;
  z-index: 2;
  user-select: none;
  animation: bounce 2s infinite;
}
.character.boy { animation-delay: 0.2s; }
.character.girl { animation-delay: 0.4s; }
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.envelope {
  width: 140px;
  height: 95px;
  cursor: pointer;
  transition: all 1s ease;
  position: relative;
  z-index: 5;
}
.envelope-body {
  width: 100%;
  height: 100%;
  background: #ff6b81;
  border-radius: 8px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 12px 24px rgba(255, 77, 109, 0.4);
}
.flap {
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 0;
  border-left: 70px solid transparent;
  border-right: 70px solid transparent;
  border-top: 45px solid #ff8fa3;
  border-bottom: none;
  transform-origin: top;
  transition: transform 0.5s;
  z-index: 2;
}
.heart {
  font-size: 2.5rem;
  position: relative;
  z-index: 1;
}

/* 点击后飞向右边的女生 */
.envelope.flying {
  transform: translateX(140px) rotate(-10deg) scale(0.9);
  opacity: 0.6;
}
.envelope.flying .flap {
  transform: rotateX(180deg);
}
.hint {
  position: absolute;
  bottom: 10px;
  color: #fff;
  font-weight: 600;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  letter-spacing: 1px;
}

/* 选择总结列表 */
.summary-list {
  list-style: none;
  text-align: left;
  background: #fff5f5;
  border-radius: 12px;
  padding: 16px 20px;
  margin-top: 16px;
}
.summary-list li {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px dashed #f0d0d0;
  font-size: 0.95rem;
  color: #555;
}
.summary-list li:last-child { border-bottom: none; }
.summary-list strong { color: #ff4d6d; }

/* 手机端适配 */
@media (max-width: 600px) {
  .card { padding: 20px; }
  h1 { font-size: 1.8rem; }
  h2 { font-size: 1.4rem; }
  .subtitle { font-size: 1rem; }
  .grid-2 { gap: 10px; }
  .item-card img { height: 120px; }
  .item-card:last-child:nth-child(odd) img { height: 140px; }
  .item-title { font-size: 0.95rem; }
  .btn { padding: 10px 18px; font-size: 0.95rem; }
  .character { font-size: 3.5rem; }
  .envelope { width: 110px; height: 75px; }
  .flap { border-left-width: 55px; border-right-width: 55px; border-top-width: 35px; }
  .envelope.flying { transform: translateX(80px) rotate(-5deg) scale(0.85); }
}
</style>