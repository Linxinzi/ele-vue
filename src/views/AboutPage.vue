<template>
  <div class="about-container">
    <!-- 背景装饰元素 -->
    <div class="particles">
      <div class="particle" v-for="i in 30" :key="i" :style="particleStyle(i)"></div>
    </div>
    <div class="grid-lines"></div>
    <div class="corner top-left"></div>
    <div class="corner top-right"></div>
    <div class="corner bottom-left"></div>
    <div class="corner bottom-right"></div>
    
    <!-- 关于系统卡片 -->
    <div class="about-card">
      <div class="card-header">
        <h1 class="about-title">系统信息</h1>
        <div class="tech-lines">
          <div class="line"></div>
          <div class="circle"></div>
          <div class="line"></div>
        </div>
      </div>
      
      <el-card class="info-card">
        <div class="card-content">
          <div class="system-info">
            <div class="info-item">
              <i class="fas fa-microchip tech-icon"></i>
              <div class="info-content">
                <h3>系统名称</h3>
                <p>虚拟电厂谷峰枢调管理系统</p>
              </div>
            </div>
            
            <div class="info-item">
              <i class="fas fa-code-branch tech-icon"></i>
              <div class="info-content">
                <h3>版本信息</h3>
                <p>1.0.2 | 稳定版</p>
              </div>
            </div>
            
            <div class="info-item">
              <i class="fas fa-user-cog tech-icon"></i>
              <div class="info-content">
                <h3>开发人员</h3>
                <p>心孜</p>
              </div>
            </div>
            
            <div class="info-item">
              <i class="fas fa-calendar-alt tech-icon"></i>
              <div class="info-content">
                <h3>发布日期</h3>
                <p>2025年7月28日</p>
              </div>
            </div>
          </div>

          
          <div class="tech-stack">
            <h2 class="section-title">技术栈</h2>
            <div class="stack-items">
              <div class="stack-item">Vue3</div>
              <div class="stack-item">TypeScript</div>
              <div class="stack-item">Element Plus</div>
              <div class="stack-item">达梦数据库</div>
              <div class="stack-item">Spring Boot</div>
              <div class="stack-item">Docker</div>
            </div>
          </div>
        </div>
        
        <div class="tech-footer">
          <div class="tech-node" v-for="i in 5" :key="i"></div>
        </div>
      </el-card>
    </div>
    
    <div class="bottom-info">
      <p>© 2025 虚拟电厂谷峰枢调系统 | 智能能源管理平台</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import '@/styles/local-fonts.css';

// 粒子动画效果
const particleStyle = (index: number) => {
  const size = Math.random() * 3 + 1;
  const posX = Math.random() * 100;
  const posY = Math.random() * 100;
  const animationDelay = Math.random() * 5;
  
  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${posX}%`,
    top: `${posY}%`,
    animationDelay: `${animationDelay}s`,
    opacity: Math.random() * 0.5 + 0.3
  };
};
</script>

<style scoped lang="scss">
@import '@/assets/fonts/font-awesome/css/all.css';
.about-container {
  position: fixed; 
  top: 60px; /* 导航栏高度 */
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: radial-gradient(circle at center, #3F5499 0%, #050a1a 100%);
  overflow: hidden;
  z-index: 1000;
}

.particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  
  .particle {
    position: absolute;
    background: #0dcaf0;
    border-radius: 50%;
    animation: float 15s infinite linear;
    
    @keyframes float {
      0% { transform: translateY(0) translateX(0); }
      25% { transform: translateY(-20px) translateX(10px); }
      50% { transform: translateY(0) translateX(20px); }
      75% { transform: translateY(20px) translateX(10px); }
      100% { transform: translateY(0) translateX(0); }
    }
  }
}

.grid-lines {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    linear-gradient(rgba(13, 202, 240, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(13, 202, 240, 0.05) 1px, transparent 1px);
  background-size: 30px 30px;
  z-index: 1;
  opacity: 0.4;
}

.corner {
  position: absolute;
  width: 20px;
  height: 20px;
  z-index: 2;
  
  &.top-left {
    top: 30px;
    left: 30px;
    border-top: 2px solid #0dcaf0;
    border-left: 2px solid #0dcaf0;
  }
  
  &.top-right {
    top: 30px;
    right: 30px;
    border-top: 2px solid #0dcaf0;
    border-right: 2px solid #0dcaf0;
  }
  
  &.bottom-left {
    bottom: 30px;
    left: 30px;
    border-bottom: 2px solid #0dcaf0;
    border-left: 2px solid #0dcaf0;
  }
  
  &.bottom-right {
    bottom: 30px;
    right: 30px;
    border-bottom: 2px solid #0dcaf0;
    border-right: 2px solid #0dcaf0;
  }
}

.about-card {
  width: 90%;
  max-width: 1000px;
  position: relative;
  z-index: 10;
  margin-top: 20px;
}

.card-header {
  text-align: center;
  margin-bottom: 30px;
  position: relative;
}

.about-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 20px;
  background: linear-gradient(90deg, #1a6dff, #0dcaf0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 15px rgba(26, 109, 255, 0.5);
  letter-spacing: 2px;
}

.tech-lines {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 15px;
  
  .line {
    width: 120px;
    height: 2px;
    background: linear-gradient(90deg, transparent, #0dcaf0, transparent);
  }
  
  .circle {
    width: 10px;
    height: 10px;
    background: #0dcaf0;
    border-radius: 50%;
    margin: 0 15px;
    box-shadow: 0 0 10px #0dcaf0;
  }
}

.info-card {
  background: rgba(16, 36, 73, 0.7);
  border: 1px solid rgba(0, 167, 255, 0.3);
  border-radius: 12px;
  box-shadow: 
    0 0 30px rgba(26, 109, 255, 0.5),
    inset 0 0 20px rgba(0, 167, 255, 0.1);
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: linear-gradient(90deg, #1a6dff, #0dcaf0);
  }
}

.card-content {
  padding: 30px;
}

.system-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 25px;
  margin-bottom: 40px;
}

.info-item {
  display: flex;
  align-items: center;
  background: rgba(10, 25, 50, 0.5);
  border: 1px solid rgba(0, 167, 255, 0.2);
  border-radius: 8px;
  padding: 20px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background: linear-gradient(90deg, #1a6dff, #0dcaf0);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.4s ease;
  }
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
    
    &::before {
      transform: scaleX(1);
    }
    
    .tech-icon {
      transform: scale(1.1);
      text-shadow: 0 0 15px #0dcaf0;
    }
  }
  
  .tech-icon {
    font-size: 2rem;
    color: #1a6dff;
    margin-right: 20px;
    transition: all 0.3s ease;
    min-width: 40px;
    text-align: center;
  }
  
  .info-content {
    h3 {
      color: #0dcaf0;
      font-size: 1.2rem;
      margin-bottom: 8px;
      letter-spacing: 1px;
    }
    
    p {
      color: #a0d7ff;
      font-size: 1rem;
      line-height: 1.5;
      margin: 0;
    }
  }
}

.section-title {
  text-align: center;
  font-size: 1.8rem;
  margin: 40px 0 30px;
  color: #e0f7ff;
  text-shadow: 0 0 10px rgba(13, 202, 240, 0.5);
  letter-spacing: 1px;
  position: relative;
  
  &::after {
    content: '';
    display: block;
    width: 80px;
    height: 3px;
    background: linear-gradient(90deg, transparent, #0dcaf0, transparent);
    margin: 12px auto;
  }
}


.tech-stack {
  margin-top: 40px;
}

.stack-items {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 15px;
  margin-top: 20px;
}

.stack-item {
  padding: 10px 20px;
  background: rgba(13, 202, 240, 0.1);
  border: 1px solid rgba(13, 202, 240, 0.3);
  border-radius: 30px;
  color: #a0d7ff;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(13, 202, 240, 0.2);
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(13, 202, 240, 0.2);
    color: #ffffff;
  }
}

.tech-footer {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 30px;
  padding: 20px 0 10px;
  
  .tech-node {
    width: 8px;
    height: 8px;
    background: #0dcaf0;
    border-radius: 50%;
    box-shadow: 0 0 8px #0dcaf0;
    animation: pulse 2s infinite;
    
    &:nth-child(2n) {
      animation-delay: 0.5s;
    }
    
    &:nth-child(3n) {
      animation-delay: 1s;
    }
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 1; }
  }
}

.bottom-info {
  position: absolute;
  bottom: 20px;
  width: 100%;
  text-align: center;
  color: rgba(125, 157, 204, 0.7);
  font-size: 0.9rem;
  letter-spacing: 1px;
  z-index: 5;
}
</style>