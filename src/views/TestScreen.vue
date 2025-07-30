<template>
  <div class="dashboard-container">
    <!-- 装饰元素 -->
    <div class="decoration" style="top: 10%; left: 5%; width: 50px; height: 50px; border: 1px solid rgba(0, 163, 255, 0.2); transform: rotate(45deg);"></div>
    <div class="decoration" style="bottom: 15%; right: 5%; width: 80px; height: 80px; border: 1px solid rgba(0, 163, 255, 0.2); border-radius: 50%;"></div>
    
    <!-- 网格线 -->
    <div class="grid-line grid-h" style="top: 33%; width: 100%; height: 1px;"></div>
    <div class="grid-line grid-h" style="top: 66%; width: 100%; height: 1px;"></div>
    <div class="grid-line grid-v" style="left: 25%; width: 1px; height: 100%;"></div>
    <div class="grid-line grid-v" style="left: 75%; width: 1px; height: 100%;"></div>
    
    <!-- 角装饰 -->
    <div class="corner corner-tl"></div>
    <div class="corner corner-tr"></div>
    <div class="corner corner-bl"></div>
    <div class="corner corner-br"></div>
    
    <!-- 头部 -->
    <div class="header">
      <div class="time-info">
        <span id="current-date">{{ currentDate }}</span> | 
        <span id="current-time">{{ currentTime }}</span>
      </div>
      <div class="title-container">
        <div class="main-title">虚拟电厂谷峰枢调系统</div>
        <div class="sub-title">社区智慧能源管理 · 绿色出行解决方案</div>
      </div>
      <div class="system-status">
        <i class="fas fa-circle status-active"></i> 系统运行正常
      </div>
    </div>
    
    <!-- 主仪表盘 -->
    <div class="dashboard">
      <!-- 左侧面板 -->
      <div class="left-panel">
        <div class="panel">
          <div class="panel-title">
            <i class="fas fa-city"></i> 社区基本信息
          </div>
          <div class="stats-container">
            <div v-for="(card, index) in statCards.slice(0, 4)" :key="index" class="stat-card" :style="{ borderLeft: '3px solid ' + card.color }">
              <div class="stat-icon" :style="{ color: card.color }">
                <i :class="'fas fa-' + card.icon"></i>
              </div>
              <div class="stat-label">{{ card.label }}</div>
              <div class="stat-value">{{ card.value }}</div>
              <div class="stat-desc">{{ card.description }}</div>
            </div>
          </div>
        </div>
        
        <div class="panel">
          <div class="panel-title">
            <i class="fas fa-bolt"></i> V2G充电站状态
          </div>
          <div class="charging-status">
            <div v-for="(item, index) in statusItems" :key="index" class="status-item">
              <div class="status-icon" :class="item.status"></div>
              <div class="status-name">{{ item.name }}</div>
              <div class="status-value">{{ item.value }}</div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 中间地图面板 -->
      <div class="center-panel">
        <div class="panel map-panel">
          <div class="panel-title">
            <i class="fas fa-map-marked-alt"></i> 小区平面分布图
          </div>
          <div class="map-container">
            <div id="communityMap">
              <!-- 背景网格 -->
              <div class="map-grid"></div>
              
              <!-- 道路系统 -->
              <div class="map-roads">
                <div class="road road-horizontal" style="top: 33%"></div>
                <div class="road road-horizontal" style="top: 66%"></div>
                <div class="road road-vertical" style="left: 25%"></div>
                <div class="road road-vertical" style="left: 50%"></div>
                <div class="road road-vertical" style="left: 75%"></div>
                
                <div class="road-curve" style="top: 33%; left: 25%; border-top-color: transparent; border-left-color: transparent;"></div>
                <div class="road-curve" style="top: 33%; left: 75%; border-top-color: transparent; border-right-color: transparent;"></div>
                <div class="road-curve" style="top: 66%; left: 25%; border-bottom-color: transparent; border-left-color: transparent;"></div>
                <div class="road-curve" style="top: 66%; left: 75%; border-bottom-color: transparent; border-right-color: transparent;"></div>
              </div>
              
              <!-- 社区中心 -->
              <div class="community-center">社区活动中心</div>
              
              <!-- 社区区域划分 -->
              <div class="community-area" style="top: 5%; left: 20%; width: 60%; height: 20%;">
                <div class="area-label">北区住宅</div>
              </div>

              <div class="community-area" style="top: 30%; left: 70%; width: 25%; height: 40%;">
                <div class="area-label">东区住宅</div>
              </div>

              <div class="community-area" style="top: 30%; left: 5%; width: 25%; height: 40%;">
                <div class="area-label">西区住宅</div>
              </div>

              <div class="community-area" style="top: 75%; left: 20%; width: 60%; height: 20%;">
                <div class="area-label">南区住宅</div>
              </div>
              
              <!-- 楼栋标记 -->
              <div v-for="building in buildings" :key="'building-'+building.id" 
                class="building-point" 
                :style="{ top: building.y + '%', left: building.x + '%' }"
                :title="building.name">
              </div>
              
              <!-- 楼栋标签 -->
              <div v-for="building in buildings" :key="'label-'+building.id" 
                class="building-label" 
                :style="{ top: building.y + '%', left: building.x + '%' }">
                {{ building.name }}
              </div>
              
              <!-- 充电站标记 -->
              <div v-for="(station, index) in chargingStations" :key="'station-'+station.id" 
                class="station-point" 
                :class="station.status"
                :style="{ top: station.y + '%', left: station.x + '%' }"
                :title="station.name"
                @click="handleStationClick(index)">
                {{ index + 1 }}
              </div>
            
              <!-- 充电站光晕 -->
              <div v-for="(station, index) in chargingStations" :key="'pulse-'+index" 
                class="pulse" 
                :class="station.status"
                :style="{
                    width: '40px', 
                    height: '40px', 
                    top: station.y + '%', 
                    left: station.x + '%'
                }">
              </div>
              
              <!-- 光伏板标记 -->
              <div v-for="guangfu in guangfus" :key="'guangfu-'+guangfu.id" 
                class="guangfu-point" 
                :style="{ top: guangfu.y + '%', left: guangfu.x + '%' }"
                :title="guangfu.name">
              </div>
              
              <!-- 光伏板光晕 -->
              <div v-for="guangfu in guangfus" :key="'pulse-gf-'+guangfu.id"
                class="pulse guangfu"
                :style="{
                    width: '40px', 
                    height: '40px', 
                    top: guangfu.y + '%', 
                    left: guangfu.x + '%'
                }">
              </div>
              <!-- 光伏板标签 -->
              <div v-for="guangfu in guangfus" :key="'label-'+guangfu.id" 
                class="guangfu-label" 
                :style="{ top: guangfu.y + '%', left: guangfu.x + '%' }">
                {{ guangfu.name }}
              </div>

              
              <!-- 储能站标签 -->
              <div v-for="chuneng in chunengs" :key="'label-'+chuneng.id" 
                class="chuneng-label" 
                :style="{ top: chuneng.y + '%', left: chuneng.x + '%' }">
                {{ chuneng.name }}
              </div>

              <div v-for="chuneng in chunengs" :key="'chuneng-'+chuneng.id" 
                class="chuneng-point" 
                :style="{ top: chuneng.y + '%', left: chuneng.x + '%' }"
                :title="chuneng.name">
              </div>
              
              <!-- 储能站光晕 -->
              <div v-for="chuneng in chunengs" :key="'pulse-gf-'+chuneng.id"
                class="pulse chuneng"
                :style="{
                    width: '40px', 
                    height: '40px', 
                    top: chuneng.y + '%', 
                    left: chuneng.x + '%'
                }">
              </div>
              
              
              
            </div>
            <div class="map-overlay">
              <div class="legend">
                <div class="legend-item">
                  <div class="legend-color building-color"></div>
                  <span>居民楼栋</span>
                </div>
                <div class="legend-item">
                  <div class="legend-color station-color"></div>
                  <span>V2G充电站</span>
                </div>
                <div class="legend-item">
                  <div class="legend-color guangfu-color"></div>
                  <span>光伏板</span>
                </div>
                <div class="legend-item">
                  <div class="legend-color chuneng-color"></div>
                  <span>储能站</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 威胁日志面板 -->
        <div class="panel threat-log-panel">
          <div class="panel-title">
            <i class="fas fa-exclamation-triangle"></i> 威胁日志实时监控
            <div class="refresh-indicator" :class="{ refreshing: isRefreshing }">
              <i class="fas fa-sync-alt"></i> 每2秒更新
            </div>
          </div>
          <div class="threat-log-container">
            <div v-for="(log, index) in threatLogs" :key="log.id" class="log-entry">
              <div class="log-number">{{ index + 1 }}</div>
              <div class="log-content">
                <span class="log-date">{{ formatDate(log.date) }}</span>
                <span class="log-ip">源IP: {{ log.detected_Ip }}</span>
                <span class="log-action">进行了{{ log.threat_Type }}攻击</span>
                <span class="log-method">使用: {{ log.threat_Name }}</span>
                <span class="log-severity" :data-severity="log.severity">危险程度: {{ getSeverityText(log.severity) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 右侧面板 -->
      <div class="right-panel">
        <div class="panel">
          <div class="panel-title">
            <i class="fas fa-chart-line"></i> 充电数据分析
          </div>
          <div class="stats-container">
            <div v-for="(card, index) in statCards.slice(4)" :key="index" class="stat-card" :style="{ borderLeft: '3px solid ' + card.color }">
              <div class="stat-icon" :style="{ color: card.color }">
                <i :class="'fas fa-' + card.icon"></i>
              </div>
              <div class="stat-label">{{ card.label }}</div>
              <div class="stat-value">{{ card.value }}</div>
              <div class="stat-desc">{{ card.description }}</div>
            </div>
          </div>
        </div>
        
        <div class="panel">
          <div class="panel-title">
            <i class="fas fa-map-marker-alt"></i> 充电站分布信息
          </div>
          <div class="distribution-status">
            <div v-for="(item, index) in distributionItems" :key="index" class="status-item">
              <div class="status-name">{{ item.name }}</div>
              <div class="status-value">{{ item.value }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 底部信息 -->
    <div class="footer">
      <div>数据更新时间: {{ updateTime }}</div>
      <div>虚拟电厂谷峰枢调系统 © 2025</div>
      <div>系统状态: <span class="status-active">运行中</span> | 版本: v2.1.5</div>
    </div>
    
    <!-- 异常通知 -->
    <div v-if="showNotification" class="notification">
      <i class="fas fa-exclamation-triangle"></i>
      <div>充电站异常状态，无法跳转！</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue';
import api from '@/services/api';

export default defineComponent({
  name: 'TestScreen',
  setup() {
    // 响应式数据
    const currentDate = ref('');
    const currentTime = ref('');
    const updateTime = ref('');
    const showNotification = ref(false);
    const isRefreshing = ref(false);
    
    // 楼栋和充电站数据
    const buildings = ref([
      // 北区住宅 (顶部区域)
      { id: 1, name: '1号楼', area: 'north', x: 25, y: 15 },
      { id: 2, name: '2号楼', area: 'north', x: 50, y: 10 },
      { id: 3, name: '3号楼', area: 'north', x: 75, y: 15 },
      { id: 4, name: '4号楼', area: 'north', x: 40, y: 20 },
      
      // 东区住宅 (右侧区域)
      { id: 5, name: '5号楼', area: 'east', x: 75, y: 35 },
      { id: 6, name: '6号楼', area: 'east', x: 90, y: 50 },
      { id: 7, name: '7号楼', area: 'east', x: 85, y: 65 },
      { id: 8, name: '8号楼', area: 'east', x: 80, y: 60 },
      
      // 西区住宅 (左侧区域)
      { id: 9, name: '9号楼', area: 'west', x: 15, y: 35 },
      { id: 10, name: '10号楼', area: 'west', x: 10, y: 50 },
      { id: 11, name: '11号楼', area: 'west', x: 15, y: 65 },
      
      // 南区住宅 (底部区域)
      { id: 12, name: '12号楼', area: 'south', x: 25, y: 85 },
      { id: 13, name: '13号楼', area: 'south', x: 35, y: 90 },
      { id: 14, name: '14号楼', area: 'south', x: 65, y: 85 }, 
      { id: 15, name: '15号楼', area: 'south', x: 50, y: 77 }
    ]);

    // 充电站位置
    const chargingStations = ref([
      { id: 1, name: '1号充电站（北）', area: 'north', x: 50, y: 5, status: 'active', capacity: 10, available: 9 },
      { id: 2, name: '2号充电站（东）', area: 'east', x: 85, y: 33, status: 'active', capacity: 10, available: 7 },
      { id: 3, name: '3号充电站（南）', area: 'south', x: 50, y: 90, status: 'error', capacity: 10, available: 6 },
      { id: 4, name: '4号充电站（西）', area: 'west', x: 8, y: 33, status: 'active', capacity: 10, available: 8 }
    ]);

    // 光伏板数据
    const guangfus = ref([
      { id: 1, name: '光伏板', area: 'north', x: 40, y: 8 }
    ]);
  
    const chunengs = ref([
      { id: 1, name: '储能站', area: 'north', x: 20, y: 8 }
    ]);
    


    // 统计数据卡片
    const statCards = computed(() => [
      { 
        label: '总楼栋数', 
        value: buildings.value.length, 
        description: '覆盖区域', 
        icon: 'building', 
        color: '#4facfe' 
      },
      { 
        label: '充电站数量', 
        value: chargingStations.value.length, 
        description: '全方向覆盖', 
        icon: 'charging-station', 
        color: '#00ff95' 
      },
      { 
        label: '今日充电量', 
        value: '1,245', 
        description: '千瓦时', 
        icon: 'bolt', 
        color: '#ffcc00' 
      },
      { 
        label: '充电利用率', 
        value: '78%', 
        description: '峰值: 92%', 
        icon: 'chart-line', 
        color: '#00f2fe' 
      },
      { 
        label: '当前负载', 
        value: '68%', 
        description: '正常范围', 
        icon: 'server', 
        color: '#4facfe' 
      },
      { 
        label: '预计峰值', 
        value: '86%', 
        description: '19:00-21:00', 
        icon: 'chart-bar', 
        color: '#ff6b6b' 
      },
      { 
        label: '平均充电时长', 
        value: '4.2', 
        description: '小时', 
        icon: 'clock', 
        color: '#9b5de5' 
      },
      { 
        label: '今日服务车辆', 
        value: '87', 
        description: '辆', 
        icon: 'car', 
        color: '#00f2fe' 
      }
    ]);
    
    // 状态项
    const statusItems = computed(() => [
      { 
        name: '1号充电站（北）', 
        value: `${chargingStations.value[0].available}/${chargingStations.value[0].capacity}`, 
        status: chargingStations.value[0].status 
      },
      { 
        name: '2号充电站（东）', 
        value: `${chargingStations.value[1].available}/${chargingStations.value[1].capacity}`, 
        status: chargingStations.value[1].status 
      },
      { 
        name: '3号充电站（南）', 
        value: `${chargingStations.value[2].available}/${chargingStations.value[2].capacity}`, 
        status: chargingStations.value[2].status 
      },
      { 
        name: '4号充电站（西）', 
        value: `${chargingStations.value[3].available}/${chargingStations.value[3].capacity}`, 
        status: chargingStations.value[3].status 
      }
    ]);
    
    // 分布信息
    const distributionItems = computed(() => [
      { name: '北充电站', value: '服务4栋楼' },
      { name: '东充电站', value: '服务4栋楼' },
      { name: '南充电站', value: '服务4栋楼' },
      { name: '西充电站', value: '服务3栋楼' }
    ]);
    
    // 威胁日志数据
    const threatLogs = ref<any[]>([]);
    
    // 格式化日期
    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleString('zh-CN', {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }).replace(/\//g, '-');
    };
    
    // 获取危险程度文本
    const getSeverityText = (severity: string) => {
      const map: Record<string, string> = {
        'Low': '低',
        'Medium': '中',
        'High': '高',
        'Critical': '严重'
      };
      return map[severity] || severity;
    };
    
    // 更新时间函数
    const updateDateTime = () => {
      const now = new Date();
      currentDate.value = now.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
      currentTime.value = now.toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      updateTime.value = now.toLocaleString('zh-CN');
    };
    
    // 获取威胁日志
  const fetchThreatLogs = async () => {
  isRefreshing.value = true;
    try {
      const response = await api.get('/api/threatlog');
    // 不再反转数组，保持原始顺序（最新日志在数组末尾）
      threatLogs.value = response.data;
    } catch (error) {
      console.error('获取威胁日志失败:', error);
    } finally {
      setTimeout(() => {
        isRefreshing.value = false;
        }, 300);
    }
  };
    
    // 处理充电站点击事件
    const handleStationClick = (index: number) => {
      const station = chargingStations.value[index];
      
      // 检查充电站状态
      // if (station.status === 'error') {
      //   showNotification.value = true;
      //   setTimeout(() => {
      //     showNotification.value = false;
      //   }, 3000);
      //   return;
      // }
      
      // 根据不同的充电站跳转到不同的URL
      const urls = [
        'http://localhost:8080/dp',  // 1号充电站
        'http://localhost:8080/dp',  // 2号充电站
        'http://localhost:8080/dp3',  // 3号充电站
        'http://localhost:8080/dp'   // 4号充电站
      ];
      
      if (index >= 0 && index < urls.length) {
        window.location.href = urls[index];
      }
    };
    
    // 组件挂载时初始化
    onMounted(() => {
      // 初始化时间
      updateDateTime();
      setInterval(updateDateTime, 1000);
      
      // 获取威胁日志
      fetchThreatLogs();
      
      // 每2秒更新一次威胁日志
      setInterval(fetchThreatLogs, 2000);
    });
    
    // 返回模板中使用的数据
    return {
      currentDate,
      currentTime,
      updateTime,
      buildings,
      chargingStations,
      guangfus,
      chunengs,
      statCards,
      statusItems,
      distributionItems,
      threatLogs,
      isRefreshing,
      formatDate,
      getSeverityText,
      handleStationClick,
      showNotification
    };
  }
});
</script>

<style scoped>
/* 保留所有样式，但添加scoped属性 */
.dashboard-container {
  width: 100%;
  height: 110%;
  position: relative;
  padding: 0px;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #0c1a3d, #162d5e);
  color: #e0f7ff;
}

/* 装饰元素 */
.decoration {
  position: absolute;
  z-index: 1;
}

/* 网格线 */
.grid-line {
  position: absolute;
  background: rgba(0, 163, 255, 0.1);
  z-index: 1;
}

/* 角装饰 */
.corner {
  position: absolute;
  width: 30px;
  height: 30px;
  border-width: 2px;
  border-style: solid;
  border-color: rgba(0, 163, 255, 0.5);
  z-index: 2;
}

.corner-tl {
  top: 10px;
  left: 10px;
  border-right: none;
  border-bottom: none;
}

.corner-tr {
  top: 10px;
  right: 10px;
  border-left: none;
  border-bottom: none;
}

.corner-bl {
  bottom: 10px;
  left: 10px;
  border-right: none;
  border-top: none;
}

.corner-br {
  bottom: 10px;
  right: 10px;
  border-left: none;
  border-top: none;
}

/* 头部样式 */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background: rgba(16, 35, 76, 0.5);
  border-radius: 4px;
  margin-bottom: 20px;
  z-index: 10;
  position: relative;
}

.time-info {
  font-size: 16px;
  color: #00f2fe;
}

.title-container {
  text-align: center;
}

.main-title {
  font-size: 28px;
  font-weight: bold;
  letter-spacing: 2px;
  background: linear-gradient(to right, #00f2fe, #00ff95);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.sub-title {
  font-size: 16px;
  color: #a0d7ff;
  margin-top: 5px;
}

.system-status {
  font-size: 16px;
  color: #00ff95;
}

.status-active {
  color: #00ff95;
  margin-right: 5px;
}

/* 主仪表盘布局 */
.dashboard {
  display: flex;
  flex: 1;
  gap: 20px;
}

.left-panel, .right-panel {
  flex: 0 0 25%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.center-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 面板样式 */
.panel {
  background: rgba(16, 35, 76, 0.5);
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  position: relative;
  overflow: hidden;
}

.panel-title {
  font-size: 18px;
  color: #00f2fe;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.panel-title i {
  margin-right: 10px;
  font-size: 20px;
}

/* 统计卡片 */
.stats-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.stat-card {
  background: rgba(0, 30, 70, 0.5);
  padding: 15px;
  border-radius: 6px;
  position: relative;
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 163, 255, 0.3);
}

.stat-icon {
  font-size: 24px;
  margin-bottom: 10px;
}

.stat-label {
  font-size: 14px;
  color: #a0d7ff;
  margin-bottom: 5px;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 5px;
}

.stat-desc {
  font-size: 12px;
  color: #5d9cec;
}

/* 地图容器 */
.map-container {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 500px;
  background: rgba(8, 20, 45, 0.6);
  border-radius: 8px;
  overflow: hidden;
}

#communityMap {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.map-grid {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    linear-gradient(rgba(0, 163, 255, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 163, 255, 0.05) 1px, transparent 1px);
  background-size: 20px 20px;
  z-index: 1;
}

.map-roads {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
}

.road {
  position: absolute;
  background: rgba(100, 100, 100, 0.3);
  z-index: 2;
}

.road-horizontal {
  width: 100%;
  height: 8px;
}

.road-vertical {
  width: 8px;
  height: 100%;
}

.road-curve {
  position: absolute;
  border-radius: 50%;
  border: 8px solid rgba(100, 100, 100, 0.3);
  width: 50px;
  height: 50px;
  z-index: 3;
}

.community-center {
  position: absolute;
  width: 60px;
  height: 60px;
  background: rgba(255, 215, 0, 0.2);
  border: 2px solid rgba(255, 215, 0, 0.5);
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 4;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffd700;
  font-size: 12px;
  text-align: center;
  padding: 5px;
}

.community-area {
  position: absolute;
  border: 1px dashed rgba(0, 163, 255, 0.5);
  border-radius: 4px;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
}

.area-label {
  background: rgba(0, 30, 70, 0.7);
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 14px;
  color: #00f2fe;
}

.building-point {
  position: absolute;
  width: 12px;
  height: 12px;
  background: #4facfe;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  z-index: 5;
  box-shadow: 0 0 10px #4facfe;
}

.building-label {
  position: absolute;
  font-size: 12px;
  color: #a0d7ff;
  transform: translate(-50%, 10px);
  z-index: 5;
  white-space: nowrap;
}

.station-point {
  position: absolute;
  width: 30px;
  height: 30px;
  background: #00ff95;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translate(-50%, -50%);
  z-index: 6;
  color: #0c1a3d;
  font-weight: bold;
  font-size: 14px;
  box-shadow: 0 0 15px #00ff95;
  cursor: pointer;
  transition: all 0.3s ease;
}

.station-point:hover {
  transform: translate(-50%, -50%) scale(1.2);
  box-shadow: 0 0 20px #00ff95;
}

.station-point.error {
  background: #ff6b6b !important;
  box-shadow: 0 0 15px #ff6b6b !important;
}

.guangfu-point {
  position: absolute;
  width: 30px;
  height: 30px;
  background: #ffd700;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translate(-50%, -50%);
  z-index: 6;
  color: #0c1a3d;
  font-weight: bold;
  font-size: 14px;
  box-shadow: 0 0 15px #ffd700;
}

.guangfu-label {
  position: absolute;
  font-size: 15px;
  color: #a0d7ff;
  transform: translate(-50%, 15px);
  z-index: 5;
  white-space: nowrap;
}

.chuneng-point {
  position: absolute;
  width: 20px;              /* 缩小圆形宽度 */
  height: 20px;             /* 缩小圆形高度 */
  background: #00ffe8;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translate(-50%, -50%);
  z-index: 6;
  color: #0c1a3d;
  font-weight: bold;
  font-size: 12px;          /* 缩小内部文字大小 */
  box-shadow: 0 0 10px #00ffe8; /* 缩小阴影效果 */
}

.chuneng-label {
  position: absolute;
  font-size: 10px;          /* 缩小标签文字大小 */
  color: #a0d7ff;
  transform: translate(-50%, 10px); /* 降低文字位置（原10px） */
  z-index: 5;
  white-space: nowrap;
}


.connection-line {
  position: absolute;
  height: 2px;
  transform-origin: 0 0;
  z-index: 4;
}

.pulse {
  position: absolute;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  z-index: 5;
}

.pulse::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 0.7;
  }
  70% {
    transform: scale(2.5);
    opacity: 0;
  }
  100% {
    transform: scale(2.5);
    opacity: 0;
  }
}

.pulse.active::after {
  background: rgba(0, 255, 149, 0.7);
}

.pulse.warning::after {
  background: rgba(255, 204, 0, 0.7);
}

.pulse.error::after {
  background: rgba(255, 107, 107, 0.7);
}

.pulse.guangfu::after {
  background: rgba(255, 215, 0, 0.7);
}

.pulse.chuneng::after {
  background: rgba(0, 255, 232, 0.7);
}

.map-overlay {
  position: absolute;
  bottom: 20px;
  right: 0px;
  z-index: 10;
}

.legend {
  background: rgba(16, 35, 76, 0.8);
  padding: 10px;
  border-radius: 4px;
  display: flex;
  gap: 15px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 5px;
}

.legend-color {
  width: 15px;
  height: 15px;
  border-radius: 3px;
}

.building-color {
  background: #4facfe;
}

.station-color {
  background: #00ff95;
}

.guangfu-color {
  background: #ffd700;
}

.chuneng-color {
  background: #00ffe8;
}

/* 状态列表 */
.charging-status, .distribution-status {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.status-item {
  background: rgba(0, 30, 70, 0.5);
  padding: 15px;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.3s ease;
}

.status-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
}

.status-icon {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-bottom: 10px;
}

.status-icon.active {
  background: #00ff95;
  box-shadow: 0 0 10px #00ff95;
}

.status-icon.warning {
  background: #ffcc00;
  box-shadow: 0 0 10px #ffcc00;
}

.status-icon.error {
  background: #ff6b6b;
  box-shadow: 0 0 10px #ff6b6b;
}

.status-name {
  font-size: 14px;
  color: #a0d7ff;
  margin-bottom: 5px;
}

.status-value {
  font-size: 18px;
  font-weight: bold;
}

/* 底部样式 */
.footer {
  display: flex;
  justify-content: space-between;
  padding: 10px 20px;
  background: rgba(16, 35, 76, 0.5);
  border-radius: 4px;
  margin-top: 20px;
  font-size: 14px;
  color: #5d9cec;
  z-index: 10;
}

.footer div {
  display: flex;
  align-items: center;
}

.status-active {
  color: #00ff95;
  margin: 0 5px;
}

.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 15px 25px;
  background: rgba(255, 107, 107, 0.9);
  color: white;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 10px;
  animation: slideIn 0.5s, fadeOut 0.5s 2.5s forwards;
}

@keyframes slideIn {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

@keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}

/* 威胁日志样式 */
.threat-log-panel {
  background: rgba(16, 35, 76, 0.5);
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  height: 200px;
}

.threat-log-container {
  height: 150px;
  overflow-y: auto;
  background: rgba(0, 30, 70, 0.3);
  border-radius: 6px;
  padding: 10px;
}

.log-entry {
  display: flex;
  padding: 10px;
  margin-bottom: 8px;
  background: rgba(0, 20, 50, 0.5);
  border-radius: 4px;
  border-left: 3px solid #ff6b6b;
  transition: all 0.3s ease;
}

.log-entry:hover {
  background: rgba(255, 107, 107, 0.1);
  transform: translateX(5px);
}

.log-number {
  width: 30px;
  height: 30px;
  background: rgba(255, 107, 107, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: #ff6b6b;
  margin-right: 15px;
  flex-shrink: 0;
}

.log-content {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  font-size: 14px;
}

.log-date {
  color: #00f2fe;
  font-weight: bold;
  background: rgba(0, 242, 254, 0.1);
  padding: 2px 8px;
  border-radius: 4px;
}

.log-ip {
  color: #ffcc00;
  font-weight: bold;
}

.log-action {
  color: #ff6b6b;
}

.log-method {
  color: #9b5de5;
}

.log-severity {
  font-weight: bold;
  padding: 2px 8px;
  border-radius: 4px;
}

/* 根据危险程度设置颜色 */
.log-severity[data-severity="Medium"] {
  color: #ffcc00;
  background: rgba(255, 204, 0, 0.1);
}

.log-severity[data-severity="High"] {
  color: #ff6b6b;
  background: rgba(255, 107, 107, 0.1);
}

.log-severity[data-severity="Critical"] {
  color: #f72585;
  background: rgba(247, 37, 133, 0.1);
}

/* 滚动条样式 */
.threat-log-container::-webkit-scrollbar {
  width: 8px;
}

.threat-log-container::-webkit-scrollbar-track {
  background: rgba(0, 20, 40, 0.3);
}

.threat-log-container::-webkit-scrollbar-thumb {
  background: rgba(0, 163, 255, 0.5);
  border-radius: 4px;
}

.threat-log-container::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 242, 254, 0.8);
}

/* 刷新指示器 */
.refresh-indicator {
  font-size: 14px;
  color: #a0d7ff;
  display: flex;
  align-items: center;
  gap: 5px;
}

.refresh-indicator i {
  transition: transform 0.5s ease;
}

.refresh-indicator.refreshing i {
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>