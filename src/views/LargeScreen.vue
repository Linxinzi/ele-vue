<template>
  <div class="container">
    <!-- 装饰元素 -->
    <div class="decoration corner corner-tl"></div>
    <div class="decoration corner corner-tr"></div>
    <div class="decoration corner corner-bl"></div>
    <div class="decoration corner corner-br"></div>
    <div class="decoration line line-top"></div>
    <div class="decoration line line-bottom"></div>
    <div class="decoration line line-left"></div>
    <div class="decoration line line-right"></div>
    
    <!-- 标题区域 -->
    <div class="header">
      <div class="title">小区充电桩实时监控平台</div>
      <div class="subtitle">实时监控 | 智能调度 | 数据分析</div>
      <div class="datetime">{{ currentDateTime }}</div>
    </div>
    
    <!-- 主内容区 -->
    <div class="main-content">
      <!-- 左侧面板 -->
      <div class="side-panel">
        <!-- 总电力卡片 -->
        <div class="data-card">
          <div class="card-header">
            <div class="card-title"><i class="fas fa-bolt"></i> 总电力</div>
            <div class="card-icon"><i class="fas fa-lightbulb"></i></div>
          </div>
          <div class="card-value">1,258<span class="card-unit">kW</span></div>
          <div class="progress-bar">
            <div class="progress-fill" :style="{width: '68%'}"></div>
            <div class="progress-text">68%</div>
          </div>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">今日用电量:</span>
              <span class="info-value">342 kW</span>
            </div>
            <div class="info-item">
              <span class="info-label">昨日用电量:</span>
              <span class="info-value">298 kW</span>
            </div>
            <div class="info-item">
              <span class="info-label">本月累计:</span>
              <span class="info-value">8,210 kW</span>
            </div>
            <div class="info-item">
              <span class="info-label">负荷预警:</span>
              <span class="info-value">正常</span>
            </div>
          </div>
        </div>
        
        <!-- 充电峰谷统计 -->
        <div class="data-card">
          <div class="card-header">
            <div class="card-title"><i class="fas fa-chart-bar"></i> 充电峰谷统计</div>
            <div class="card-icon"><i class="fas fa-wave-square"></i></div>
          </div>
          <div class="chart-container" ref="peakChart"></div>
          <div class="peak-info">
            <div class="peak-item">
              <div class="peak-label">高峰时段</div>
              <div class="peak-value">16:00-22:00</div>
            </div>
            <div class="peak-item">
              <div class="peak-label">峰值电量</div>
              <div class="peak-value">230 kW</div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 中间充电桩状态 -->
      <div class="charger-container">
        <div class="section-title">充电桩实时状态</div>
        <div class="status-summary">
          <div class="status-item">
            <div class="status-label">总数</div>
            <div class="status-value">10</div>
          </div>
          <div class="status-item normal">
            <div class="status-label">正常运行</div>
            <div class="status-value">10</div>
          </div>
          <div class="status-item abnormal">
            <div class="status-label">异常</div>
            <div class="status-value">0</div>
          </div>
          <div class="status-item">
            <div class="status-label">使用率</div>
            <div class="status-value">100%</div>
          </div>
        </div>
        
        <div class="charger-grid">
          <div v-for="(charger, index) in chargers" :key="index" class="charger-item">
            <div class="charger-header">
              <div class="charger-name">充电桩 #{{ charger.id }}</div>
              <div :class="['charger-status', charger.status === 'normal' ? 'status-normal' : 'status-abnormal']">
                <div class="status-indicator"></div>
                {{ charger.status === 'normal' ? '正常' : '异常' }}
              </div>
            </div>
            <div class="charger-content">
              <div class="charger-image">
                <div class="charger-icon">
                  <i class="fas fa-charging-station"></i>
                </div>
                <div class="power-indicator">
                  <div class="power-bar" :style="{height: charger.status === 'normal' ? (charger.power * 10 + 10) + '%' : '0%'}"></div>
                </div>
              </div>
              <div class="charger-info">
                <div class="info-item">
                  <span class="info-label">当前功率:</span>
                  <span class="info-value">{{ charger.power }} kW</span>
                </div>
                <div class="info-item">
                  <span class="info-label">已充电量:</span>
                  <span class="info-value">{{ charger.consumed }} kWh</span>
                </div>
                <div class="info-item">
                  <span class="info-label">使用时长:</span>
                  <span class="info-value">{{ charger.duration }} 分钟</span>
                </div>
                <div class="info-item">
                  <span class="info-label">充电费用:</span>
                  <span class="info-value">{{ (charger.consumed * 0.86).toFixed(2) }} 元</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 右侧面板 -->
      <div class="side-panel">
        <!-- 实时电价卡片 -->
        <div class="data-card">
          <div class="card-header">
            <div class="card-title"><i class="fas fa-money-bill-wave"></i> 实时电价</div>
            <div class="card-icon"><i class="fas fa-coins"></i></div>
          </div>
          <div class="card-value">0.86<span class="card-unit">元/kWh</span></div>
          <div class="price-period">
            <div class="period-item peak">
              <div class="period-label">峰时电价</div>
              <div class="period-value">1.25元</div>
              <div class="period-time">(8:00-22:00)</div>
            </div>
            <div class="period-item valley">
              <div class="period-label">谷时电价</div>
              <div class="period-value">0.48元</div>
              <div class="period-time">(22:00-8:00)</div>
            </div>
          </div>
          <div class="price-trend">
            <div class="trend-label">价格趋势:</div>
            <div class="trend-value">稳定</div>
          </div>
        </div>
        
        <!-- 用户使用统计 -->
        <div class="data-card">
          <div class="card-header">
            <div class="card-title"><i class="fas fa-users"></i> 使用用户统计</div>
            <div class="card-icon"><i class="fas fa-user-clock"></i></div>
          </div>
          <div class="card-value">1,248<span class="card-unit">人</span></div>
          <div class="user-chart">
            <div class="chart-bar" v-for="(item, index) in userStats" :key="index" 
                 :style="{height: item.value * 0.8 + 'px'}">
              <div class="bar-value">{{ item.value }}</div>
            </div>
          </div>
          <div class="user-stats">
            <div class="stat-item">
              <div class="stat-label">今日新增</div>
              <div class="stat-value">28人</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">本月累计</div>
              <div class="stat-value">342人</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">使用率</div>
              <div class="stat-value">78.5%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 底部状态栏 - 固定在页脚内 -->
    <div class="footer">
      <div class="footer-content">
        <div class="system-status">
          <i class="fas fa-circle status-active"></i> 系统运行正常
        </div>
        <div class="update-time">
          最后更新: {{ currentTime }}
        </div>
        <div class="data-source">
          <i class="fas fa-database"></i> 数据源: 小区充电桩管理系统
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue';
import * as echarts from 'echarts';

export default defineComponent({
  name: 'LargeScreen',
  setup() {
    const chargers = ref([
      { id: 'C001', status: 'normal', power: 7.2, consumed: 24.8, duration: 45 },
      { id: 'C002', status: 'normal', power: 6.8, consumed: 18.3, duration: 32 },
      { id: 'C003', status: 'normal', power: 6.6, consumed: 29.3, duration: 60 },
      { id: 'C004', status: 'normal', power: 7.5, consumed: 32.1, duration: 58 },
      { id: 'C005', status: 'normal', power: 6.5, consumed: 15.7, duration: 30 },
      { id: 'C006', status: 'normal', power: 7.0, consumed: 28.9, duration: 55 },
      { id: 'C007', status: 'normal', power: 7.2, consumed: 33.2, duration: 67 },
      { id: 'C008', status: 'normal', power: 6.9, consumed: 20.4, duration: 38 },
      { id: 'C009', status: 'normal', power: 7.3, consumed: 26.7, duration: 50 },
      { id: 'C010', status: 'normal', power: 6.7, consumed: 17.2, duration: 35 }
    ]);
    
    const userStats = ref([
      { label: '周一', value: 120 },
      { label: '周二', value: 145 },
      { label: '周三', value: 98 },
      { label: '周四', value: 167 },
      { label: '周五', value: 210 },
      { label: '周六', value: 185 },
      { label: '周日', value: 142 }
    ]);
    
    const currentDateTime = computed(() => {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const week = ['日', '一', '二', '三', '四', '五', '六'][now.getDay()];
      return `${year}年${month}月${day}日 星期${week}`;
    });
    
    const currentTime = computed(() => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      return `${hours}:${minutes}:${seconds}`;
    });
    
    const peakChart = ref<HTMLElement | null>(null);

    onMounted(() => {
      if (peakChart.value) {
        const chart = echarts.init(peakChart.value);
        const option = {
          backgroundColor: 'transparent',
          tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(16, 36, 73, 0.9)',
            borderColor: '#00a7ff',
            textStyle: {
              color: '#ffffff'
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '15%',
            top: '10%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            data: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
            axisLine: {
              lineStyle: {
                color: 'rgba(125, 157, 204, 0.5)'
              }
            },
            axisLabel: {
              color: '#a0d7ff',
              fontSize: 10
            },
            axisTick: {
              show: false
            }
          },
          yAxis: {
            type: 'value',
            name: '充电量 (kWh)',
            nameTextStyle: {
              color: '#7d9dcc',
              fontSize: 10
            },
            axisLine: {
              show: false
            },
            axisLabel: {
              color: '#a0d7ff',
              fontSize: 10
            },
            splitLine: {
              lineStyle: {
                color: 'rgba(125, 157, 204, 0.1)'
              }
            }
          },
          series: [
            {
              name: '充电量',
              type: 'bar',
              data: [45, 32, 180, 210, 175, 230, 80],
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#1a6dff' },
                  { offset: 1, color: '#0dcaf0' }
                ]),
                borderRadius: [3, 3, 0, 0]
              },
              barWidth: '35%',
              label: {
                show: true,
                position: 'top',
                color: '#0dcaf0',
                fontSize: 10
              }
            }
          ]
        };
        
        chart.setOption(option);
        
        window.addEventListener('resize', () => {
          chart.resize();
        });
      }
    });
    
    return {
      chargers,
      userStats,
      peakChart,
      currentDateTime,
      currentTime
    };
  }
});
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Microsoft YaHei', 'Arial', sans-serif;
}

.container {
  width: 100%;
  height: 100vh;
  position: relative;
  background: radial-gradient(circle at center, #0c1b3a 0%, #050a1a 100%);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding: 10px;
  box-shadow: inset 0 0 50px rgba(0, 86, 179, 0.3);
}

/* 装饰元素 */
.decoration {
  position: absolute;
  z-index: 0;
}

.decoration.corner {
  width: 15px;
  height: 15px;
  border: 1px solid #0d6efd;
}

.decoration.corner-tl {
  top: 10px;
  left: 10px;
  border-right: none;
  border-bottom: none;
}

.decoration.corner-tr {
  top: 10px;
  right: 10px;
  border-left: none;
  border-bottom: none;
}

.decoration.corner-bl {
  bottom: 60px; /* 调整底部位置避免与页脚重叠 */
  left: 10px;
  border-right: none;
  border-top: none;
}

.decoration.corner-br {
  bottom: 60px; /* 调整底部位置避免与页脚重叠 */
  right: 10px;
  border-left: none;
  border-top: none;
}

.decoration.line {
  position: absolute;
  background: linear-gradient(90deg, transparent, #0d6efd, transparent);
  z-index: 0;
}

.decoration.line-top {
  top: 10px;
  left: 30px;
  right: 30px;
  height: 1px;
}

.decoration.line-bottom {
  bottom: 60px; /* 调整底部位置避免与页脚重叠 */
  left: 30px;
  right: 30px;
  height: 1px;
}

.decoration.line-left {
  left: 10px;
  top: 30px;
  bottom: 70px; /* 调整底部位置避免与页脚重叠 */
  width: 1px;
}

.decoration.line-right {
  right: 10px;
  top: 30px;
  bottom: 70px; /* 调整底部位置避免与页脚重叠 */
  width: 1px;
}

/* 标题区域 */
.header {
  height: 80px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  padding: 10px 0;
  margin-bottom: 10px;
  z-index: 1;
}

.title {
  font-size: 32px;
  font-weight: bold;
  background: linear-gradient(90deg, #1a6dff, #0dcaf0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 15px rgba(26, 109, 255, 0.5);
  letter-spacing: 3px;
  position: relative;
  padding: 0 20px;
}

.title::before, .title::after {
  content: "";
  position: absolute;
  top: 50%;
  width: 50px;
  height: 2px;
  background: linear-gradient(90deg, transparent, #0dcaf0);
}

.title::before {
  left: -60px;
}

.title::after {
  right: -60px;
  background: linear-gradient(90deg, #0dcaf0, transparent);
}

.subtitle {
  font-size: 14px;
  color: #7d9dcc;
  margin-top: 5px;
  letter-spacing: 2px;
  text-shadow: 0 0 5px rgba(125, 157, 204, 0.5);
}

.datetime {
  position: absolute;
  top: 15px;
  right: 20px;
  font-size: 14px;
  color: #a0d7ff;
  background: rgba(13, 110, 253, 0.2);
  padding: 5px 10px;
  border-radius: 15px;
  border: 1px solid rgba(0, 167, 255, 0.3);
}

/* 主要内容区域 */
.main-content {
  display: grid;
  grid-template-columns: 1fr 3fr 1fr;
  gap: 15px;
  height: calc(100% - 80px - 50px); /* 减去标题和页脚高度 */
  padding: 0 5px;
  z-index: 1;
  overflow: hidden;
}

/* 左右侧面板 */
.side-panel {
  display: flex;
  flex-direction: column;
  gap: 15px;
  height: 100%;
}

/* 数据卡片 */
.data-card {
  background: linear-gradient(145deg, rgba(16, 36, 73, 0.7), rgba(8, 18, 37, 0.9));
  border: 1px solid rgba(0, 167, 255, 0.2);
  border-radius: 8px;
  padding: 15px;
  box-shadow: 
    0 0 15px rgba(0, 167, 255, 0.1),
    inset 0 0 10px rgba(0, 167, 255, 0.05);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
}

.data-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 167, 255, 0.3);
}

.data-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, #00a7ff, #00f2fe);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.card-title {
  font-size: 16px;
  color: #0dcaf0;
  display: flex;
  align-items: center;
}

.card-title i {
  margin-right: 8px;
  font-size: 16px;
}

.card-icon {
  color: rgba(13, 202, 240, 0.3);
  font-size: 20px;
}

.card-value {
  font-size: 32px;
  font-weight: bold;
  text-align: center;
  margin: 52px 0;
  background: linear-gradient(180deg, #ffffff, #a0d7ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 10px rgba(160, 215, 255, 0.3);
}

.card-unit {
  font-size: 16px;
  color: #7d9dcc;
  margin-left: 4px;
  font-weight: normal;
}

.progress-bar {
  height: 10px;
  background: rgba(125, 157, 204, 0.1);
  border-radius: 5px;
  margin: 10px 0;
  position: relative;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #1a6dff, #0dcaf0);
  border-radius: 5px;
  position: relative;
  transition: width 1s ease;
}

.progress-text {
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 10px;
  color: #fff;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 10px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  padding: 5px;
  background: rgba(0, 167, 255, 0.05);
  border-radius: 3px;
}

.info-label {
  color: #7d9dcc;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-right: 5px;
}

.info-value {
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #a0d7ff;
}

/* 充电桩状态区域 */
.charger-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.section-title {
  font-size: 18px;
  color: #0dcaf0;
  margin-bottom: 10px;
  padding-left: 10px;
  position: relative;
}

.section-title::before {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 16px;
  background: #0dcaf0;
  border-radius: 2px;
}

.status-summary {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-bottom: 15px;
}

.status-item {
  background: rgba(16, 36, 73, 0.7);
  border: 1px solid rgba(0, 167, 255, 0.2);
  border-radius: 6px;
  padding: 10px;
  text-align: center;
  transition: all 0.3s ease;
}

.status-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 3px 10px rgba(0, 167, 255, 0.2);
}

.status-item.normal {
  border-top: 3px solid #28a745;
}

.status-item.abnormal {
  border-top: 3px solid #dc3545;
}

.status-label {
  font-size: 12px;
  color: #7d9dcc;
  margin-bottom: 5px;
}

.status-value {
  font-size: 20px;
  font-weight: bold;
  color: #a0d7ff;
}

.charger-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  height: 100%;
  overflow-y: auto;
  padding: 5px;
}

.charger-item {
  background: linear-gradient(145deg, rgba(16, 36, 73, 0.7), rgba(8, 18, 37, 0.9));
  border: 1px solid rgba(0, 167, 255, 0.2);
  border-radius: 8px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
}

.charger-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 167, 255, 0.2);
  border-color: rgba(0, 167, 255, 0.5);
}

.charger-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(125, 157, 204, 0.2);
}

.charger-name {
  font-size: 14px;
  font-weight: bold;
  color: #a0d7ff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.charger-status {
  padding: 4px 10px;
  border-radius: 15px;
  font-size: 12px;
  font-weight: bold;
  flex-shrink: 0;
  display: flex;
  align-items: center;
}

.status-normal {
  background: rgba(40, 167, 69, 0.15);
  color: #28a745;
}

.status-abnormal {
  background: rgba(220, 53, 69, 0.15);
  color: #dc3545;
  animation: blink 1.5s infinite;
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 5px;
}

.status-normal .status-indicator {
  background: #28a745;
  box-shadow: 0 0 8px #28a745;
}

.status-abnormal .status-indicator {
  background: #dc3545;
  box-shadow: 0 0 8px #dc3545;
}

@keyframes blink {
  0% { opacity: 1; }
  50% { opacity: 0.6; }
  100% { opacity: 1; }
}

.charger-content {
  display: flex;
  flex: 1;
}

.charger-image {
  width: 70px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.charger-icon {
  width: 50px;
  height: 50px;
  background: rgba(0, 167, 255, 0.05);
  border: 1px solid rgba(0, 167, 255, 0.3);
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #0dcaf0;
  font-size: 24px;
  margin-bottom: 10px;
}

.power-indicator {
  width: 10px;
  height: 60px;
  background: rgba(125, 157, 204, 0.1);
  border-radius: 5px;
  position: relative;
  overflow: hidden;
}

.power-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, #1a6dff, #0dcaf0);
  border-radius: 5px;
  transition: height 1s ease;
}

.charger-info {
  flex: 1;
  padding-left: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

/* 右侧面板特定样式 */
.price-period {
  display: flex;
  justify-content: space-between;
  margin: 15px 0;
}

.period-item {
  flex: 1;
  text-align: center;
  padding: 8px;
  border-radius: 6px;
}

.period-item.peak {
  background: rgba(255, 193, 7, 0.1);
  border: 1px solid rgba(255, 193, 7, 0.3);
  margin-right: 5px;
}

.period-item.valley {
  background: rgba(13, 202, 240, 0.1);
  border: 1px solid rgba(13, 202, 240, 0.3);
  margin-left: 5px;
}

.period-label {
  font-size: 12px;
  color: #7d9dcc;
}

.period-value {
  font-size: 18px;
  font-weight: bold;
  margin: 5px 0;
}

.peak .period-value {
  color: #ffc107;
}

.valley .period-value {
  color: #0dcaf0;
}

.period-time {
  font-size: 10px;
  color: #7d9dcc;
}

.price-trend {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(0, 167, 255, 0.05);
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 12px;
}

.trend-label {
  color: #7d9dcc;
}

.trend-value {
  color: #28a745;
  font-weight: bold;
}

.user-chart {
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  height: 80px;
  margin: 15px 0;
  padding: 0 10px;
}

.chart-bar {
  width: 25px;
  background: linear-gradient(to top, #1a6dff, #0dcaf0);
  border-radius: 3px 3px 0 0;
  position: relative;
  transition: height 1s ease;
}

.bar-value {
  position: absolute;
  bottom: -20px;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 10px;
  color: #7d9dcc;
}

.user-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.stat-item {
  text-align: center;
  background: rgba(0, 167, 255, 0.05);
  padding: 8px 5px;
  border-radius: 5px;
}

.stat-label {
  font-size: 10px;
  color: #7d9dcc;
  margin-bottom: 3px;
}

.stat-value {
  font-size: 14px;
  font-weight: bold;
  color: #a0d7ff;
}

.chart-container {
  width: 100%;
  height: 150px;
  flex: 1;
}

.peak-info {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}

.peak-item {
  flex: 1;
  text-align: center;
  background: rgba(0, 167, 255, 0.05);
  padding: 8px;
  border-radius: 5px;
}

.peak-label {
  font-size: 12px;
  color: #7d9dcc;
}

.peak-value {
  font-size: 16px;
  font-weight: bold;
  color: #0dcaf0;
  margin-top: 5px;
}

/* 底部状态栏 - 固定在页脚内 */
.footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50px;
  background: rgba(8, 18, 37, 0.9);
  border-top: 1px solid rgba(0, 167, 255, 0.3);
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
}

.footer-content {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1800px;
  margin: 0 auto;
}

.system-status, .update-time, .data-source {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #7d9dcc;
}

.status-active {
  color: #28a745;
  font-size: 8px;
  margin-right: 8px;
  text-shadow: 0 0 5px #28a745;
}

.data-source i {
  margin-right: 8px;
  color: #0dcaf0;
}

/* 响应式调整 */
@media (max-width: 1200px) {
  .main-content {
    grid-template-columns: 1fr 2fr 1fr;
  }
  
  .charger-name {
    font-size: 12px;
  }
}

@media (max-width: 992px) {
  .main-content {
    grid-template-columns: 1fr;
    height: calc(100% - 80px - 60px); /* 增加页脚高度 */
  }
  
  .side-panel {
    flex-direction: row;
    gap: 10px;
  }
  
  .data-card {
    min-height: 200px;
  }
  
  .charger-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .footer {
    height: 60px;
  }
  
  .footer-content {
    flex-direction: column;
    gap: 5px;
    padding: 5px 0;
  }
}

@media (max-width: 768px) {
  .side-panel {
    flex-direction: column;
  }
  
  .title {
    font-size: 24px;
  }
  
  .title::before, .title::after {
    width: 30px;
  }
  
  .title::before {
    left: -40px;
  }
  
  .title::after {
    right: -40px;
  }
  
  .charger-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .footer-content {
    font-size: 12px;
  }
}

@media (max-height: 800px) {
  .header {
    height: 70px;
  }
  
  .title {
    font-size: 28px;
  }
  
  .main-content {
    height: calc(100% - 70px - 40px);
  }
  
  .card-title {
    font-size: 14px;
  }
  
  .card-value {
    font-size: 28px;
  }

  .footer {
    height: 40px;
  }
}
</style>

<style>
/* 全局字体图标样式 */
/* @import 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css'; */

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(125, 157, 204, 0.1);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: rgba(0, 167, 255, 0.4);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 167, 255, 0.6);
}
</style>