<template>
  <div class="home-container">
    <!-- 背景装饰元素 -->
    <div class="particles">
      <div class="particle" v-for="i in 30" :key="i" :style="particleStyle(i)"></div>
    </div>
    <div class="grid-lines"></div>
    <div class="corner top-left"></div>
    <div class="corner top-right"></div>
    <div class="corner bottom-left"></div>
    <div class="corner bottom-right"></div>
    
    <!-- 主内容卡片 -->
    <div class="home-card">
      <div class="card-header">
        <h1 class="home-title">虚拟电厂谷峰枢调系统</h1>
        <div class="tech-lines">
          <div class="line"></div>
          <div class="circle"></div>
          <div class="line"></div>
        </div>
      </div>
      
      <el-card class="system-card">
        <div class="card-content">
          <h2 class="welcome-title">欢迎使用后台管理系统</h2>
          <div class="info-grid">
            <div class="info-item">
              <i class="fas fa-users tech-icon"></i>
              <h3>用户管理系统</h3>
              <p>全面管理平台用户权限与角色分配</p>
            </div>
            <div class="info-item">
              <i class="fas fa-bolt tech-icon"></i>
              <h3>电力调度系统</h3>
              <p>实时监控与优化电力资源分配</p>
            </div>
            <div class="info-item">
              <i class="fas fa-database tech-icon"></i>
              <h3>达梦数据库支持</h3>
              <p>安全可靠的国产数据库解决方案</p>
            </div>
            <div class="info-item">
              <i class="fas fa-chart-line tech-icon"></i>
              <h3>数据分析平台</h3>
              <p>提供多维度的电力数据分析报告</p>
            </div>
          </div>
          
          <div class="stats-container">
            <div class="stat-item">
              <div class="stat-value">24h/7d</div>
              <div class="stat-label">全天候运行</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">99.9%</div>
              <div class="stat-label">系统可用率</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">5ms</div>
              <div class="stat-label">实时响应</div>
            </div>
          </div>
        </div>
        
        <div class="tech-footer">
          <div class="tech-node" v-for="i in 5" :key="i"></div>
        </div>
      </el-card>
    </div>
    
    <div class="bottom-info">
      <p>© 2025 虚拟电厂谷峰枢调系统</p>
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
.home-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
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

.home-card {
  width: 85%;
  max-width: 1000px;
  position: relative;
  z-index: 10;
  margin-top: 0;
  transform: translateY(-20px);
}

.card-header {
  text-align: center;
  margin-bottom: 20px;
  position: relative;
}

.home-title {
  font-size: 2.3rem;
  font-weight: 700;
  margin-bottom: 15px;
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
  margin-top: 10px;
  
  .line {
    width: 120px;
    height: 2px;
    background: linear-gradient(90deg, transparent, #0dcaf0, transparent);
  }
  
  .circle {
    width: 8px;
    height: 8px;
    background: #0dcaf0;
    border-radius: 50%;
    margin: 0 12px;
    box-shadow: 0 0 8px #0dcaf0;
  }
}

.system-card {
  background: rgba(16, 36, 73, 0.7);
  border: 1px solid rgba(0, 167, 255, 0.3);
  border-radius: 12px;
  box-shadow: 
    0 0 25px rgba(26, 109, 255, 0.4),
    inset 0 0 15px rgba(0, 167, 255, 0.1);
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
  padding: 20px;
}

.welcome-title {
  text-align: center;
  font-size: 1.7rem;
  margin-bottom: 25px;
  color: #e0f7ff;
  text-shadow: 0 0 8px rgba(13, 202, 240, 0.5);
  letter-spacing: 1px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.info-item {
  background: rgba(10, 25, 50, 0.5);
  border: 1px solid rgba(0, 167, 255, 0.2);
  border-radius: 8px;
  padding: 20px;
  text-align: center;
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
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.25);
    
    &::before {
      transform: scaleX(1);
    }
    
    .tech-icon {
      transform: scale(1.1);
      text-shadow: 0 0 12px #0dcaf0;
    }
  }
  
  h3 {
    color: #0dcaf0;
    font-size: 1.3rem;
    margin: 15px 0 10px;
    letter-spacing: 1px;
  }
  
  p {
    color: #a0d7ff;
    font-size: 0.95rem;
    line-height: 1.5;
  }
}

.tech-icon {
  font-size: 2.2rem;
  color: #1a6dff;
  margin-bottom: 12px;
  transition: all 0.3s ease;
}

.stats-container {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-top: 25px;
  flex-wrap: wrap;
}

.stat-item {
  text-align: center;
  min-width: 120px;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(90deg, #1a6dff, #0dcaf0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 8px;
  text-shadow: 0 0 8px rgba(26, 109, 255, 0.3);
}

.stat-label {
  color: #a0d7ff;
  font-size: 1rem;
  letter-spacing: 1px;
  position: relative;
  padding-bottom: 6px;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 40px;
    height: 2px;
    background: #0dcaf0;
  }
}

.tech-footer {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 20px;
  padding: 15px 0 8px;
  
  .tech-node {
    width: 7px;
    height: 7px;
    background: #0dcaf0;
    border-radius: 50%;
    box-shadow: 0 0 6px #0dcaf0;
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
  font-size: 0.85rem;
  letter-spacing: 1px;
  z-index: 5;
}
</style>