/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Activity, 
  Cpu, 
  TrendingUp, 
  Zap, 
  MessageSquare, 
  Shield, 
  Globe, 
  Settings,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Terminal,
  Cpu as ChipIcon,
  Camera,
  Upload,
  Eye
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { getMarketAnalysis, getMiningStrategy, chatWithAI, deepOptimize, verifyWithMempool, analyzeHardwareImage } from './components/AIService';

// --- Types ---
interface MiningStats {
  hashrate: number;
  shares: number;
  efficiency: number;
  earnings: number;
  temp: number;
}

interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

// --- Mock Data Generators ---
const generateHashrateData = (base: number) => {
  return Array.from({ length: 20 }, (_, i) => ({
    time: `${i}:00`,
    value: base + (Math.random() - 0.5) * 10,
  }));
};

interface MiningConfig {
  // Hardware & Network
  hardware: string;
  firmware: string;
  pool: string;
  workerName: string;
  workerPass: string;
  ipAddress: string;
  macAddress: string;
  dnsPrimary: string;
  dnsSecondary: string;
  dhcpEnabled: boolean;
  location: string;
  rackId: string;
  slotId: string;
  mtuSize: number;
  tcpKeepalive: boolean;
  stratumTimeout: number;
  dnsOverHttps: boolean;
  staticRoute: string;
  bandwidthLimit: number;
  networkPriority: 'High' | 'Normal' | 'Low';

  // Performance & Overclocking
  overclockProfile: 'Eco' | 'Normal' | 'Turbo' | 'Custom';
  powerLimit: number;
  voltage: number;
  frequency: number;
  asicBoost: boolean;
  lowPowerMode: boolean;
  startDelay: number;
  targetHashrate: number;
  chipHealthThreshold: number;
  boardTempDelta: number;
  psuEfficiencyMode: boolean;
  voltageRippleTolerance: number;
  chipFreqStep: number;

  // Cooling & Environment
  fanControl: 'Auto' | 'Manual';
  fanSpeed: number;
  targetTemp: number;
  criticalTemp: number;
  ambientTempOffset: number;
  immersionMode: boolean;
  humiditySensor: boolean;
  airflowVelocity: number;
  intakeTemp: number;
  exhaustTemp: number;
  soundLevelMonitoring: boolean;
  vibrationSensor: boolean;
  overheatShutdown: boolean;
  underclockOnHeat: boolean;

  // Economics & Payouts
  electricityCost: number;
  currency: string;
  payoutThreshold: number;
  poolFee: number;
  devFee: number;
  hardwareCost: number;
  amortizationMonths: number;
  taxRate: number;
  poolPriority: number;
  failoverPool1: string;
  failoverPool2: string;
  poolFailover3: string;
  poolFailover4: string;
  poolSelectionLogic: 'Priority' | 'LoadBalance' | 'Latency';
  soloMiningMode: boolean;
  mergedMining: boolean;

  // Security & Access
  sshEnabled: boolean;
  sshPort: number;
  httpPort: number;
  apiPort: number;
  webPassword: string;
  apiKey: string;
  twoFactorAuth: boolean;
  firewallLevel: 'Low' | 'Medium' | 'High';
  vpnEnabled: boolean;
  auditLogging: boolean;
  kycStatus: 'Pending' | 'Verified' | 'Not Required';
  dataResidency: 'Local' | 'EU' | 'US';
  privacyMode: boolean;
  ipWhitelist: string;
  rateLimitRequests: number;
  intrusionDetectionLevel: 'Off' | 'Low' | 'High';
  sslCertificatePath: string;
  tlsVerification: boolean;
  sniEnabled: boolean;

  // Monitoring & Alerts
  notifications: boolean;
  emailAlerts: boolean;
  smsAlerts: boolean;
  discordWebhook: string;
  telegramBotToken: string;
  loggingLevel: 'Debug' | 'Info' | 'Warning' | 'Error';
  statsInterval: number;
  csvExportEnabled: boolean;
  jsonApiEnabled: boolean;
  prometheusEnabled: boolean;
  cloudSyncProvider: 'None' | 'AWS' | 'GCP' | 'Azure';
  alertThresholdHashrate: number;
  alertThresholdTemp: number;
  alertThresholdFan: number;
  notificationCooldown: number;
  reportFrequency: 'Daily' | 'Weekly' | 'Monthly';
  dataRetentionDays: number;
  influxDbUrl: string;
  grafanaEnabled: boolean;
  mqttBrokerUrl: string;

  // AI Architecture & Neural Tuning
  aiModelArchitecture: 'Transformer' | 'RNN' | 'CNN';
  aiDropoutRate: number;
  aiBatchSize: number;
  aiOptimizer: 'Adam' | 'SGD' | 'RMSprop';
  aiWeightDecay: number;
  aiQuantization: 'INT8' | 'FP16' | 'FP32';
  aiPruningEnabled: boolean;
  aiDistillationEnabled: boolean;
  aiExplainabilityEnabled: boolean;
  aiBiasDetection: boolean;

  // Micro-Hardware Granularity
  board1Voltage: number;
  board2Voltage: number;
  board3Voltage: number;
  chipVoltageOffset: number;
  individualChipTuning: boolean;
  voltageRippleTolerance: number;
  chipFrequencyStep: number;

  // Enterprise Networking & Security
  vlanId: number;
  vpnType: 'OpenVPN' | 'WireGuard' | 'IPSec';
  vpnServer: string;
  vpnPort: number;
  mtuAutoDiscovery: boolean;
  packetLossTolerance: number;
  jitterBufferMs: number;
  encryptionAlgorithm: 'AES-256' | 'ChaCha20';
  secureBootEnabled: boolean;
  tpmModuleEnabled: boolean;
  soc2ComplianceMode: boolean;
  gdprComplianceMode: boolean;
  auditTrailEnabled: boolean;

  // Economic Intelligence
  halvingCountdownEnabled: boolean;
  difficultyAdjustmentPrediction: boolean;
  mempoolMonitoring: boolean;
  blockExplorerUrl: string;
  customRpcUrl: string;

  // Environmental & Industrial
  airFiltrationLevel: number;
  noiseCancellationEnabled: boolean;
  heatReuseSystem: boolean;
  heatReuseTargetTemp: number;
  immersionFluidType: string;
  immersionFluidLevel: number;

  // User Experience & Accessibility
  hapticFeedbackEnabled: boolean;
  customAlertSoundUrl: string;
  screenReaderSupport: boolean;
  highContrastMode: boolean;
  dashboardRefreshInterval: number;
  autoExportReports: boolean;
  reportFormat: 'PDF' | 'CSV' | 'JSON';
  cloudBackupEnabled: boolean;
  backupFrequency: 'Hourly' | 'Daily' | 'Weekly';
  externalDisplayEnabled: boolean;
  externalDisplayBrightness: number;

  // Gemini Features
  aiChatbotEnabled: boolean;
  aiImageGenEnabled: boolean;
  aiVideoGenEnabled: boolean;
  googleMapsGrounding: boolean;
  googleSearchGrounding: boolean;
}

export default function App() {
  const [config, setConfig] = useState<MiningConfig>({
    hardware: 'Antminer S21',
    firmware: 'Stock',
    pool: 'Foundry USA',
    workerName: 'worker1',
    workerPass: 'x',
    ipAddress: '192.168.1.100',
    macAddress: '00:1A:2B:3C:4D:5E',
    dnsPrimary: '8.8.8.8',
    dnsSecondary: '8.8.4.4',
    dhcpEnabled: true,
    location: 'Data Center A',
    rackId: 'R-04',
    slotId: 'S-12',
    mtuSize: 1500,
    tcpKeepalive: true,
    stratumTimeout: 60,
    dnsOverHttps: false,
    staticRoute: '',
    bandwidthLimit: 0,
    networkPriority: 'Normal',

    overclockProfile: 'Normal',
    powerLimit: 3500,
    voltage: 1200,
    frequency: 650,
    asicBoost: true,
    lowPowerMode: false,
    startDelay: 30,
    targetHashrate: 200,
    chipHealthThreshold: 95,
    boardTempDelta: 15,
    psuEfficiencyMode: true,
    voltageRippleTolerance: 5,
    chipFreqStep: 10,

    fanControl: 'Auto',
    fanSpeed: 60,
    targetTemp: 75,
    criticalTemp: 95,
    ambientTempOffset: 0,
    immersionMode: false,
    humiditySensor: true,
    airflowVelocity: 2.5,
    intakeTemp: 22,
    exhaustTemp: 45,
    soundLevelMonitoring: false,
    vibrationSensor: true,
    overheatShutdown: true,
    underclockOnHeat: true,

    electricityCost: 0.12,
    currency: 'USD',
    payoutThreshold: 0.01,
    poolFee: 1.0,
    devFee: 0.5,
    hardwareCost: 4500,
    amortizationMonths: 18,
    taxRate: 0,
    poolPriority: 1,
    failoverPool1: 'AntPool',
    failoverPool2: 'F2Pool',
    poolFailover3: 'SlushPool',
    poolFailover4: 'ViaBTC',
    poolSelectionLogic: 'Priority',
    soloMiningMode: false,
    mergedMining: true,

    sshEnabled: true,
    sshPort: 22,
    httpPort: 80,
    apiPort: 4028,
    webPassword: '••••••••',
    apiKey: 'sk-mining-12345',
    twoFactorAuth: false,
    firewallLevel: 'Medium',
    vpnEnabled: false,
    auditLogging: true,
    kycStatus: 'Not Required',
    dataResidency: 'Local',
    privacyMode: false,
    ipWhitelist: '',
    rateLimitRequests: 100,
    intrusionDetectionLevel: 'Low',
    sslCertificatePath: '',
    tlsVerification: true,
    sniEnabled: true,

    notifications: true,
    emailAlerts: false,
    smsAlerts: false,
    discordWebhook: '',
    telegramBotToken: '',
    loggingLevel: 'Info',
    statsInterval: 5,
    csvExportEnabled: false,
    jsonApiEnabled: true,
    prometheusEnabled: false,
    cloudSyncProvider: 'None',
    alertThresholdHashrate: 100,
    alertThresholdTemp: 85,
    alertThresholdFan: 20,
    notificationCooldown: 300,
    reportFrequency: 'Daily',
    dataRetentionDays: 30,
    influxDbUrl: '',
    grafanaEnabled: false,
    mqttBrokerUrl: '',

    aiLearningRate: 0.01,
    aiModelVersion: 'v2.4.1-stable',
    aiRetrainInterval: 24,
    aiOptimizationTarget: 'Efficiency',
    aiConfidenceThreshold: 0.85,
    deepAnalysisEnabled: true,
    predictiveMaintenance: true,
    aiAnomalySensitivity: 0.5,
    aiDataSamplingRate: 10,
    aiNeuralNetDepth: 5,
    autoSwitchChain: false,
    profitabilityThreshold: 0.05,

    aiModelArchitecture: 'Transformer',
    aiDropoutRate: 0.1,
    aiBatchSize: 32,
    aiOptimizer: 'Adam',
    aiWeightDecay: 0.0001,
    aiQuantization: 'FP16',
    aiPruningEnabled: false,
    aiDistillationEnabled: false,
    aiExplainabilityEnabled: true,
    aiBiasDetection: true,

    board1Voltage: 12.0,
    board2Voltage: 12.0,
    board3Voltage: 12.0,
    chipVoltageOffset: 0,
    individualChipTuning: false,
    voltageRippleTolerance: 0.05,
    chipFrequencyStep: 5,

    vlanId: 0,
    vpnType: 'WireGuard',
    vpnServer: '',
    vpnPort: 51820,
    mtuAutoDiscovery: true,
    packetLossTolerance: 0.01,
    jitterBufferMs: 20,
    encryptionAlgorithm: 'AES-256',
    secureBootEnabled: true,
    tpmModuleEnabled: true,
    soc2ComplianceMode: false,
    gdprComplianceMode: false,
    auditTrailEnabled: true,

    halvingCountdownEnabled: true,
    difficultyAdjustmentPrediction: true,
    mempoolMonitoring: true,
    blockExplorerUrl: 'https://mempool.space',
    customRpcUrl: '',

    airFiltrationLevel: 100,
    noiseCancellationEnabled: false,
    heatReuseSystem: false,
    heatReuseTargetTemp: 45,
    immersionFluidType: 'Mineral Oil',
    immersionFluidLevel: 100,

    hapticFeedbackEnabled: false,
    customAlertSoundUrl: '',
    screenReaderSupport: false,
    highContrastMode: false,
    dashboardRefreshInterval: 5,
    autoExportReports: false,
    reportFormat: 'PDF',
    cloudBackupEnabled: false,
    backupFrequency: 'Daily',
    externalDisplayEnabled: false,
    externalDisplayBrightness: 80,

    aiChatbotEnabled: true,
    aiImageGenEnabled: true,
    aiVideoGenEnabled: true,
    googleMapsGrounding: true,
    googleSearchGrounding: true,

    stratumV2: false,
    stratumUserAgent: 'BitAI-Miner/2.4',
    stratumPingInterval: 30,
    proxyUrl: '',
    difficulty: 0,
    extraNonce: true,
    resumeOnPowerLoss: true,
    quietHoursEnabled: false,
    quietHoursStart: '22:00',
    quietHoursEnd: '06:00',
    peakHoursThrottle: true,
    autoRebootLowHashrate: true,
    lowHashrateThreshold: 50,
    autoUpdateFirmware: false,
    maintenanceWindow: 'Sunday 02:00',
    blockTemplateTimeout: 30,
    submissionRetryLimit: 3,
    shareDiffThreshold: 1024,
    staleShareTolerance: 0.5,
    blockPropagationAlert: true,
    rebootOnKernelPanic: true,
    watchdogTimeout: 300,
    hardwareWatchdogEnabled: true,
    errorThreshold: 10,

    warrantyExpiryDate: '2027-12-31',
    purchaseDate: '2025-01-01',
    lastMaintenanceDate: '2026-01-15',
    partReplacementLog: true,
    totalRuntimeHours: 1240,
    componentRuntimeFan1: 1240,
    componentRuntimeFan2: 1240,
    psuRuntimeHours: 1240,
    liquidCoolingPumpSpeed: 0,
    liquidCoolingFlowRate: 0,
    liquidCoolingReservoirLevel: 100,
    externalFanPwm: 0,
    ambientLightSensor: true,
    dustSensorEnabled: false,
    maintenanceReminderInterval: 90,
    technicianContactEmail: 'support@bitai.io',
    inventoryAssetTag: 'ASIC-001-NYC',
    depreciationMethod: 'StraightLine',
    insurancePolicyNumber: 'POL-998877',

    psuPhaseBalancing: true,
    powerFactorCorrection: 0.98,
    upsIntegrationEnabled: false,
    upsBatteryThreshold: 20,
    smartPlugIp: '',
    co2SensorEnabled: false,
    smokeDetectorIntegration: true,
    fireSuppressionSystem: false,
    energySource: 'Grid',
    carbonOffsetEnabled: false,
    taxJurisdiction: 'US-NY',

    theme: 'Cyberpunk',
    language: 'EN',
    tempUnit: 'C',
    uiRefreshRate: 3,
    soundAlerts: true,
    ledStatusEnabled: true,
    nightModeLed: false,
    customCss: '',
    userRole: 'Admin',
    multiUserEnabled: false,
    sessionTimeout: 3600,
    customDashboardLayout: 'Default',
    enableBetaFeatures: false,
    fontSize: 14,
    colorBlindMode: 'None',
    voiceCommandsEnabled: false,
    debugModeEnabled: false,
    maxHashrateLimit: 200,
    minHashrateAlert: 100,
    fanStartTemp: 45,
    fanStopTemp: 35,
    psuEcoMode: true,
    psuFanAlwaysOn: false,
    networkDns1: '8.8.8.8',
    networkDns2: '1.1.1.1',
    ntpServer: 'pool.ntp.org',
    timezone: 'UTC',
    enableSshRootLogin: false,
    sshKeyPath: '/home/miner/.ssh/authorized_keys',
    apiTokenExpiry: 86400,
    maxApiRequestsPerMinute: 60,
    enableCors: false,
    corsAllowedOrigins: '*',
    logRetentionDays: 30,
    logLevelFile: 'Info',
    enableSyslog: false,
    syslogServer: ''
  });
  const [stats, setStats] = useState<MiningStats>({
    hashrate: 145.2,
    shares: 1240,
    efficiency: 98.4,
    earnings: 0.0042,
    temp: 68
  });
  const [showSettings, setShowSettings] = useState(false);
  const [isMining, setIsMining] = useState(true);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [marketAnalysis, setMarketAnalysis] = useState<string | null>(null);
  const [strategy, setStrategy] = useState<string | null>(null);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'ai', text: string }[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isChatting, setIsChatting] = useState(false);
  const [deepOptResult, setDeepOptResult] = useState<string | null>(null);
  const [isDeepOptimizing, setIsDeepOptimizing] = useState(false);
  const [showDeepOpt, setShowDeepOpt] = useState(false);
  const [mempoolData, setMempoolData] = useState<string | null>(null);
  const [isVerifyingMempool, setIsVerifyingMempool] = useState(false);
  const [hardwareAnalysis, setHardwareAnalysis] = useState<string | null>(null);
  const [isAnalyzingHardware, setIsAnalyzingHardware] = useState(false);
  const [hardwareImage, setHardwareImage] = useState<string | null>(null);

  const hashrateData = useMemo(() => generateHashrateData(stats.hashrate), [stats.hashrate]);

  // --- Effects ---
  useEffect(() => {
    if (!isMining) return;

    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        hashrate: prev.hashrate + (Math.random() - 0.5) * 2,
        shares: prev.shares + Math.floor(Math.random() * 5),
        earnings: prev.earnings + 0.000001,
        temp: 65 + Math.random() * 10
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, [isMining]);

  useEffect(() => {
    addLog('System initialized. Connecting to AI mining core...', 'info');
    setTimeout(() => addLog('Connection established. Optimizing hashrate...', 'success'), 1500);
  }, []);

  const addLog = (message: string, type: LogEntry['type']) => {
    const newLog: LogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      message,
      type
    };
    setLogs(prev => [newLog, ...prev].slice(0, 50));
  };

  const handleAnalyzeMarket = async () => {
    setIsAnalyzing(true);
    addLog('Requesting AI market analysis...', 'info');
    try {
      const result = await getMarketAnalysis();
      setMarketAnalysis(result || 'No analysis available.');
      addLog('Market analysis received.', 'success');
    } catch (err) {
      addLog('Failed to fetch market analysis.', 'error');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGetStrategy = async () => {
    setIsAnalyzing(true);
    addLog(`Generating strategy for ${config.hardware} at $${config.electricityCost}/kWh...`, 'info');
    try {
      const result = await getMiningStrategy(stats.hashrate, config.electricityCost);
      setStrategy(result || 'No strategy available.');
      addLog('Mining strategy generated.', 'success');
    } catch (err) {
      addLog('Failed to generate strategy.', 'error');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const userMsg = chatMessage;
    setChatMessage('');
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsChatting(true);

    try {
      const aiResponse = await chatWithAI(userMsg, stats);
      setChatHistory(prev => [...prev, { role: 'ai', text: aiResponse || 'I am sorry, I could not process that.' }]);
    } catch (err) {
      setChatHistory(prev => [...prev, { role: 'ai', text: 'Error connecting to AI core.' }]);
    } finally {
      setIsChatting(false);
    }
  };

  const handleDeepOptimize = async () => {
    setIsDeepOptimizing(true);
    addLog('Initiating Deep AI Optimization (Thinking Mode: HIGH)...', 'warning');
    try {
      const result = await deepOptimize(stats);
      setDeepOptResult(result || 'Optimization failed.');
      setShowDeepOpt(true);
      addLog('Deep optimization complete. New parameters ready.', 'success');
    } catch (err) {
      addLog('Deep optimization failed.', 'error');
    } finally {
      setIsDeepOptimizing(false);
    }
  };

  const handleVerifyMempool = async () => {
    setIsVerifyingMempool(true);
    addLog('Verifying network data with mempool.space...', 'info');
    try {
      const result = await verifyWithMempool();
      setMempoolData(result || 'Verification failed.');
      addLog('Mempool verification complete.', 'success');
    } catch (err) {
      addLog('Mempool verification failed.', 'error');
    } finally {
      setIsVerifyingMempool(false);
    }
  };

  const handleHardwareUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = (reader.result as string).split(',')[1];
      setHardwareImage(reader.result as string);
      setIsAnalyzingHardware(true);
      addLog('Analyzing hardware image...', 'info');
      try {
        const result = await analyzeHardwareImage(base64, file.type);
        setHardwareAnalysis(result || 'Analysis failed.');
        addLog('Hardware analysis complete.', 'success');
      } catch (err) {
        addLog('Hardware analysis failed.', 'error');
      } finally {
        setIsAnalyzingHardware(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#E4E3E0] font-sans selection:bg-emerald-500/30">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/40 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-500 rounded flex items-center justify-center">
              <Activity className="w-5 h-5 text-black" />
            </div>
            <h1 className="text-lg font-medium tracking-tight flex items-center gap-2">
              BitAI <span className="text-white/40 font-normal italic">Miner v2.4</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowSettings(true)}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors text-white/60"
              title="Mining Options"
            >
              <Settings className="w-5 h-5" />
            </button>
            <button 
              onClick={handleDeepOptimize}
              disabled={isDeepOptimizing}
              className="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-all disabled:opacity-50"
            >
              {isDeepOptimizing ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3" />}
              DEEP OPTIMIZE
            </button>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-500">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              NETWORK: MAINNET
            </div>
            <button 
              onClick={() => setIsMining(!isMining)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                isMining 
                ? 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20' 
                : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
              }`}
            >
              {isMining ? 'STOP MINING' : 'START MINING'}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto p-6 grid grid-cols-12 gap-6">
        
        {/* Left Column: Stats & Chart */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard 
              label="HASHRATE" 
              value={`${stats.hashrate.toFixed(1)} TH/s`} 
              icon={<Cpu className="w-4 h-4" />}
              trend="+2.4%"
              isPositive={true}
            />
            <StatCard 
              label="SHARES" 
              value={stats.shares.toLocaleString()} 
              icon={<Shield className="w-4 h-4" />}
              trend="99.8% ACC"
              isPositive={true}
            />
            <StatCard 
              label="EFFICIENCY" 
              value={`${stats.efficiency}%`} 
              icon={<Zap className="w-4 h-4" />}
              trend="-0.2%"
              isPositive={false}
            />
            <StatCard 
              label="EST. EARNINGS" 
              value={`${stats.earnings.toFixed(6)} BTC`} 
              icon={<TrendingUp className="w-4 h-4" />}
              trend="≈ $245.20"
              isPositive={true}
            />
          </div>

          {/* Main Chart */}
          <div className="bg-black/40 border border-white/10 rounded-2xl p-6 h-[400px] relative overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-sm font-medium text-white/60 uppercase tracking-wider">Hashrate Performance</h2>
                <p className="text-2xl font-mono font-medium">{stats.hashrate.toFixed(1)} TH/s</p>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 text-[10px] bg-white/5 border border-white/10 rounded hover:bg-white/10">1H</button>
                <button className="px-3 py-1 text-[10px] bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 rounded">24H</button>
                <button className="px-3 py-1 text-[10px] bg-white/5 border border-white/10 rounded hover:bg-white/10">7D</button>
              </div>
            </div>
            <div className="h-full pb-12">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={hashrateData}>
                  <defs>
                    <linearGradient id="colorHash" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                  <XAxis 
                    dataKey="time" 
                    stroke="#ffffff20" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="#ffffff20" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false}
                    domain={['dataMin - 5', 'dataMax + 5']}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#000', border: '1px solid #ffffff10', fontSize: '12px' }}
                    itemStyle={{ color: '#10b981' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#10b981" 
                    fillOpacity={1} 
                    fill="url(#colorHash)" 
                    strokeWidth={2}
                    animationDuration={1000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI Insights Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-black/40 border border-white/10 rounded-2xl p-6 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-emerald-500" />
                  <h3 className="text-sm font-medium uppercase tracking-wider">Market Analysis</h3>
                </div>
                <button 
                  onClick={handleAnalyzeMarket}
                  disabled={isAnalyzing}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto max-h-[200px] text-xs leading-relaxed text-white/60 font-mono">
                {marketAnalysis ? (
                  <div className="whitespace-pre-wrap">{marketAnalysis}</div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full gap-2 opacity-40">
                    <TrendingUp className="w-8 h-8" />
                    <p>Click refresh to analyze market</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-black/40 border border-white/10 rounded-2xl p-6 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-500" />
                  <h3 className="text-sm font-medium uppercase tracking-wider">Mempool Status</h3>
                </div>
                <button 
                  onClick={handleVerifyMempool}
                  disabled={isVerifyingMempool}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${isVerifyingMempool ? 'animate-spin' : ''}`} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto max-h-[200px] text-xs leading-relaxed text-white/60 font-mono">
                {mempoolData ? (
                  <div className="whitespace-pre-wrap">{mempoolData}</div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full gap-2 opacity-40">
                    <Globe className="w-8 h-8" />
                    <p>Verify data with mempool.space</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-black/40 border border-white/10 rounded-2xl p-6 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <ChipIcon className="w-4 h-4 text-emerald-500" />
                  <h3 className="text-sm font-medium uppercase tracking-wider">AI Strategy</h3>
                </div>
                <button 
                  onClick={handleGetStrategy}
                  disabled={isAnalyzing}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto max-h-[200px] text-xs leading-relaxed text-white/60 font-mono">
                {strategy ? (
                  <div className="whitespace-pre-wrap">{strategy}</div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full gap-2 opacity-40">
                    <Settings className="w-8 h-8" />
                    <p>Generate optimized strategy</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Hardware Diagnostics Section */}
          <div className="bg-black/40 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-emerald-500" />
                <h3 className="text-sm font-medium uppercase tracking-wider">Hardware Diagnostics</h3>
              </div>
              <label className="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium bg-white/5 border border-white/10 hover:bg-white/10 cursor-pointer transition-all">
                <Upload className="w-3 h-3" />
                UPLOAD RIG PHOTO
                <input type="file" accept="image/*" className="hidden" onChange={handleHardwareUpload} />
              </label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="aspect-video bg-black/60 rounded-xl border border-dashed border-white/10 flex items-center justify-center overflow-hidden relative group">
                {hardwareImage ? (
                  <img src={hardwareImage} alt="Hardware" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <div className="text-center space-y-2 opacity-30">
                    <Camera className="w-12 h-12 mx-auto" />
                    <p className="text-xs font-mono">No image uploaded</p>
                  </div>
                )}
                {isAnalyzingHardware && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                    <div className="flex flex-col items-center gap-3">
                      <RefreshCw className="w-8 h-8 text-emerald-500 animate-spin" />
                      <p className="text-xs font-mono text-emerald-500">AI ANALYZING...</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/10 overflow-y-auto max-h-[250px] font-mono text-xs leading-relaxed text-white/60">
                {hardwareAnalysis ? (
                  <div className="whitespace-pre-wrap">{hardwareAnalysis}</div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full gap-2 opacity-30">
                    <Eye className="w-8 h-8" />
                    <p>AI analysis will appear here</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Chat & Logs */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          
          {/* AI Chat */}
          <div className="bg-black/40 border border-white/10 rounded-2xl flex flex-col h-[500px]">
            <div className="p-4 border-b border-white/10 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-500" />
              <h3 className="text-sm font-medium uppercase tracking-wider">BitAI Assistant</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-xs">
              {chatHistory.length === 0 && (
                <div className="text-center text-white/30 mt-10">
                  Ask BitAI about mining optimization, pool selection, or market trends.
                </div>
              )}
              {chatHistory.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-xl ${
                    msg.role === 'user' 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                    : 'bg-white/5 text-white/80 border border-white/10'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isChatting && (
                <div className="flex justify-start">
                  <div className="bg-white/5 p-3 rounded-xl border border-white/10 animate-pulse">
                    Thinking...
                  </div>
                </div>
              )}
            </div>
            <form onSubmit={handleChat} className="p-4 border-t border-white/10">
              <div className="relative">
                <input 
                  type="text" 
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-emerald-500/50 transition-colors"
                />
                <button 
                  type="submit"
                  disabled={isChatting}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-emerald-500 hover:text-emerald-400 disabled:opacity-50"
                >
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>

          {/* System Logs */}
          <div className="bg-black/40 border border-white/10 rounded-2xl flex flex-col h-[300px]">
            <div className="p-4 border-b border-white/10 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-white/40" />
              <h3 className="text-sm font-medium uppercase tracking-wider">System Logs</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2 font-mono text-[10px]">
              <AnimatePresence initial={false}>
                {logs.map((log) => (
                  <motion.div 
                    key={log.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex gap-3"
                  >
                    <span className="text-white/20">[{log.timestamp}]</span>
                    <span className={
                      log.type === 'success' ? 'text-emerald-500' :
                      log.type === 'error' ? 'text-red-500' :
                      log.type === 'warning' ? 'text-amber-500' :
                      'text-white/40'
                    }>
                      {log.message}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>

      {/* Footer / Status Bar */}
      <footer className="border-t border-white/10 bg-black/40 p-4">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between text-[10px] font-mono text-white/40 uppercase tracking-widest">
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              CORE TEMP: {stats.temp.toFixed(1)}°C
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              UPTIME: 14D 02H 12M
            </div>
          </div>
          <div>
            SECURE CONNECTION: AES-256-GCM
          </div>
        </div>
      </footer>

      {/* Deep Optimization Modal */}
      <AnimatePresence>
        {showDeepOpt && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-[#121214] border border-amber-500/30 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl shadow-amber-500/10"
            >
              <div className="p-6 border-b border-white/10 flex items-center justify-between bg-amber-500/5">
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-amber-500" />
                  <h2 className="text-lg font-medium tracking-tight">Deep AI Optimization Report</h2>
                </div>
                <button 
                  onClick={() => setShowDeepOpt(false)}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                >
                  <RefreshCw className="w-4 h-4 text-white/40 rotate-45" />
                </button>
              </div>
              <div className="p-8 max-h-[60vh] overflow-y-auto font-mono text-sm leading-relaxed text-white/70">
                <div className="whitespace-pre-wrap">{deepOptResult}</div>
              </div>
              <div className="p-6 border-t border-white/10 bg-black/20 flex justify-end">
                <button 
                  onClick={() => setShowDeepOpt(false)}
                  className="px-6 py-2 bg-amber-500 text-black text-xs font-bold rounded-full hover:bg-amber-400 transition-colors"
                >
                  APPLY PARAMETERS
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-[#121214] border border-white/10 rounded-3xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <h2 className="text-lg font-medium">Mining Configuration</h2>
                <button onClick={() => setShowSettings(false)} className="text-white/40 hover:text-white">
                  <RefreshCw className="w-4 h-4 rotate-45" />
                </button>
              </div>
              <div className="p-6 space-y-8 max-h-[80vh] overflow-y-auto custom-scrollbar">
                {/* Hardware & Network */}
                <div className="space-y-4">
                  <h3 className="text-[10px] font-mono text-emerald-500 uppercase tracking-widest border-b border-emerald-500/20 pb-1 flex items-center gap-2">
                    <Cpu className="w-3 h-3" /> Hardware & Network
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Hardware Profile</label>
                      <select 
                        value={config.hardware}
                        onChange={(e) => setConfig({...config, hardware: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald-500/50"
                      >
                        <option value="Antminer S21">Antminer S21 (200 TH/s)</option>
                        <option value="Antminer S19 Pro">Antminer S19 Pro (110 TH/s)</option>
                        <option value="Whatsminer M50S">Whatsminer M50S (126 TH/s)</option>
                        <option value="Custom Rig">Custom Rig</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Firmware</label>
                      <select 
                        value={config.firmware}
                        onChange={(e) => setConfig({...config, firmware: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald-500/50"
                      >
                        <option value="Stock">Stock Manufacturer</option>
                        <option value="BraiinsOS">BraiinsOS+</option>
                        <option value="LuxOS">LuxOS</option>
                        <option value="VNish">VNish</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Worker Name</label>
                      <input 
                        type="text" 
                        value={config.workerName}
                        onChange={(e) => setConfig({...config, workerName: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald-500/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Worker Password</label>
                      <input 
                        type="text" 
                        value={config.workerPass}
                        onChange={(e) => setConfig({...config, workerPass: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald-500/50"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">IP Address</label>
                      <input 
                        type="text" 
                        value={config.ipAddress}
                        onChange={(e) => setConfig({...config, ipAddress: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald-500/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">MAC Address</label>
                      <input 
                        type="text" 
                        value={config.macAddress}
                        onChange={(e) => setConfig({...config, macAddress: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald-500/50"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Location</label>
                      <input 
                        type="text" 
                        value={config.location}
                        onChange={(e) => setConfig({...config, location: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald-500/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Rack ID</label>
                      <input 
                        type="text" 
                        value={config.rackId}
                        onChange={(e) => setConfig({...config, rackId: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald-500/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Slot ID</label>
                      <input 
                        type="text" 
                        value={config.slotId}
                        onChange={(e) => setConfig({...config, slotId: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald-500/50"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">DNS Primary</label>
                      <input 
                        type="text" 
                        value={config.dnsPrimary}
                        onChange={(e) => setConfig({...config, dnsPrimary: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald-500/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">DNS Secondary</label>
                      <input 
                        type="text" 
                        value={config.dnsSecondary}
                        onChange={(e) => setConfig({...config, dnsSecondary: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald-500/50"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">MTU Size</label>
                      <input 
                        type="number" 
                        value={config.mtuSize}
                        onChange={(e) => setConfig({...config, mtuSize: parseInt(e.target.value)})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald-500/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Stratum Timeout</label>
                      <input 
                        type="number" 
                        value={config.stratumTimeout}
                        onChange={(e) => setConfig({...config, stratumTimeout: parseInt(e.target.value)})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald-500/50"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">TCP Keepalive</label>
                      <button 
                        onClick={() => setConfig({...config, tcpKeepalive: !config.tcpKeepalive})}
                        className={`w-10 h-5 rounded-full transition-colors relative ${config.tcpKeepalive ? 'bg-emerald-500' : 'bg-white/10'}`}
                      >
                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${config.tcpKeepalive ? 'left-6' : 'left-1'}`} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">DNS over HTTPS</label>
                      <button 
                        onClick={() => setConfig({...config, dnsOverHttps: !config.dnsOverHttps})}
                        className={`w-10 h-5 rounded-full transition-colors relative ${config.dnsOverHttps ? 'bg-emerald-500' : 'bg-white/10'}`}
                      >
                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${config.dnsOverHttps ? 'left-6' : 'left-1'}`} />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Network Priority</label>
                      <select 
                        value={config.networkPriority}
                        onChange={(e) => setConfig({...config, networkPriority: e.target.value as any})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald-500/50"
                      >
                        <option value="High">High</option>
                        <option value="Normal">Normal</option>
                        <option value="Low">Low</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Bandwidth (KB/s)</label>
                      <input 
                        type="number" 
                        value={config.bandwidthLimit}
                        onChange={(e) => setConfig({...config, bandwidthLimit: parseInt(e.target.value)})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald-500/50"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">NTP Server</label>
                      <input 
                        type="text" 
                        value={config.ntpServer}
                        onChange={(e) => setConfig({...config, ntpServer: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald-500/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Timezone</label>
                      <input 
                        type="text" 
                        value={config.timezone}
                        onChange={(e) => setConfig({...config, timezone: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald-500/50"
                      />
                    </div>
                  </div>
                </div>

                {/* Performance & Overclocking */}
                <div className="space-y-4">
                  <h3 className="text-[10px] font-mono text-amber-500 uppercase tracking-widest border-b border-amber-500/20 pb-1 flex items-center gap-2">
                    <Zap className="w-3 h-3" /> Performance & Overclocking
                  </h3>
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Overclock Profile</label>
                    <div className="grid grid-cols-4 gap-2">
                      {(['Eco', 'Normal', 'Turbo', 'Custom'] as const).map((p) => (
                        <button
                          key={p}
                          onClick={() => setConfig({...config, overclockProfile: p})}
                          className={`py-2 text-[10px] font-mono rounded-lg border transition-all ${
                            config.overclockProfile === p 
                            ? 'bg-amber-500/20 border-amber-500 text-amber-500' 
                            : 'bg-white/5 border-white/10 text-white/40 hover:border-white/20'
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Power Limit (W)</label>
                      <input 
                        type="number" 
                        value={config.powerLimit}
                        onChange={(e) => setConfig({...config, powerLimit: parseInt(e.target.value)})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald-500/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Voltage (mV)</label>
                      <input 
                        type="number" 
                        value={config.voltage}
                        onChange={(e) => setConfig({...config, voltage: parseInt(e.target.value)})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald-500/50"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Frequency (MHz)</label>
                      <input 
                        type="number" 
                        value={config.frequency}
                        onChange={(e) => setConfig({...config, frequency: parseInt(e.target.value)})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald-500/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Target Hashrate (TH/s)</label>
                      <input 
                        type="number" 
                        value={config.targetHashrate}
                        onChange={(e) => setConfig({...config, targetHashrate: parseInt(e.target.value)})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald-500/50"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">AsicBoost</label>
                      <button 
                        onClick={() => setConfig({...config, asicBoost: !config.asicBoost})}
                        className={`w-10 h-5 rounded-full transition-colors relative ${config.asicBoost ? 'bg-emerald-500' : 'bg-white/10'}`}
                      >
                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${config.asicBoost ? 'left-6' : 'left-1'}`} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Low Power</label>
                      <button 
                        onClick={() => setConfig({...config, lowPowerMode: !config.lowPowerMode})}
                        className={`w-10 h-5 rounded-full transition-colors relative ${config.lowPowerMode ? 'bg-emerald-500' : 'bg-white/10'}`}
                      >
                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${config.lowPowerMode ? 'left-6' : 'left-1'}`} />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Health Threshold (%)</label>
                      <input 
                        type="number" 
                        value={config.chipHealthThreshold}
                        onChange={(e) => setConfig({...config, chipHealthThreshold: parseInt(e.target.value)})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald-500/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Board Delta (°C)</label>
                      <input 
                        type="number" 
                        value={config.boardTempDelta}
                        onChange={(e) => setConfig({...config, boardTempDelta: parseInt(e.target.value)})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald-500/50"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Max Hashrate (TH/s)</label>
                      <input 
                        type="number" 
                        value={config.maxHashrateLimit}
                        onChange={(e) => setConfig({...config, maxHashrateLimit: parseInt(e.target.value)})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald-500/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Min Hashrate Alert</label>
                      <input 
                        type="number" 
                        value={config.minHashrateAlert}
                        onChange={(e) => setConfig({...config, minHashrateAlert: parseInt(e.target.value)})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald-500/50"
                      />
                    </div>
                  </div>
                </div>

                {/* Cooling & Environment */}
                <div className="space-y-4">
                  <h3 className="text-[10px] font-mono text-blue-500 uppercase tracking-widest border-b border-blue-500/20 pb-1 flex items-center gap-2">
                    <Activity className="w-3 h-3" /> Cooling & Environment
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Fan Control</label>
                      <select 
                        value={config.fanControl}
                        onChange={(e) => setConfig({...config, fanControl: e.target.value as 'Auto' | 'Manual'})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald-500/50"
                      >
                        <option value="Auto">Auto</option>
                        <option value="Manual">Manual %</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Target Temp (°C)</label>
                      <input 
                        type="number" 
                        value={config.targetTemp}
                        onChange={(e) => setConfig({...config, targetTemp: parseInt(e.target.value)})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald-500/50"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Critical Temp (°C)</label>
                      <input 
                        type="number" 
                        value={config.criticalTemp}
                        onChange={(e) => setConfig({...config, criticalTemp: parseInt(e.target.value)})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald-500/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Ambient Offset</label>
                      <input 
                        type="number" 
                        value={config.ambientTempOffset}
                        onChange={(e) => setConfig({...config, ambientTempOffset: parseInt(e.target.value)})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald-500/50"
                      />
                    </div>
                  </div>
                  {config.fanControl === 'Manual' && (
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Fan Speed</label>
                        <span className="text-[10px] font-mono text-emerald-500">{config.fanSpeed}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={config.fanSpeed}
                        onChange={(e) => setConfig({...config, fanSpeed: parseInt(e.target.value)})}
                        className="w-full accent-emerald-500"
                      />
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Airflow (m/s)</label>
                      <input 
                        type="number" 
                        step="0.1"
                        value={config.airflowVelocity}
                        onChange={(e) => setConfig({...config, airflowVelocity: parseFloat(e.target.value)})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald-500/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Intake Temp (°C)</label>
                      <input 
                        type="number" 
                        value={config.intakeTemp}
                        onChange={(e) => setConfig({...config, intakeTemp: parseInt(e.target.value)})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald-500/50"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Sound Monitor</label>
                      <button 
                        onClick={() => setConfig({...config, soundLevelMonitoring: !config.soundLevelMonitoring})}
                        className={`w-10 h-5 rounded-full transition-colors relative ${config.soundLevelMonitoring ? 'bg-emerald-500' : 'bg-white/10'}`}
                      >
                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${config.soundLevelMonitoring ? 'left-6' : 'left-1'}`} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Vibration Sen.</label>
                      <button 
                        onClick={() => setConfig({...config, vibrationSensor: !config.vibrationSensor})}
                        className={`w-10 h-5 rounded-full transition-colors relative ${config.vibrationSensor ? 'bg-emerald-500' : 'bg-white/10'}`}
                      >
                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${config.vibrationSensor ? 'left-6' : 'left-1'}`} />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Fan Start Temp (°C)</label>
                      <input 
                        type="number" 
                        value={config.fanStartTemp}
                        onChange={(e) => setConfig({...config, fanStartTemp: parseInt(e.target.value)})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald-500/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Fan Stop Temp (°C)</label>
                      <input 
                        type="number" 
                        value={config.fanStopTemp}
                        onChange={(e) => setConfig({...config, fanStopTemp: parseInt(e.target.value)})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald-500/50"
                      />
                    </div>
                  </div>
                </div>

                {/* AI & Optimization */}
                <div className="space-y-4 pt-4 border-t border-white/5">
                  <h3 className="text-[10px] font-mono text-amber-500 uppercase tracking-widest border-b border-amber-500/20 pb-1 flex items-center gap-2">
                    <Zap className="w-3 h-3" /> AI & Optimization
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Learning Rate</label>
                      <input 
                        type="number" 
                        step="0.001"
                        value={config.aiLearningRate}
                        onChange={(e) => setConfig({...config, aiLearningRate: parseFloat(e.target.value)})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-amber-500/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Opt. Target</label>
                      <select 
                        value={config.aiOptimizationTarget}
                        onChange={(e) => setConfig({...config, aiOptimizationTarget: e.target.value as any})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-amber-500/50"
                      >
                        <option value="Profit">Profit</option>
                        <option value="Efficiency">Efficiency</option>
                        <option value="Stability">Stability</option>
                        <option value="Longevity">Longevity</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Deep Analysis</label>
                      <button 
                        onClick={() => setConfig({...config, deepAnalysisEnabled: !config.deepAnalysisEnabled})}
                        className={`w-10 h-5 rounded-full transition-colors relative ${config.deepAnalysisEnabled ? 'bg-amber-500' : 'bg-white/10'}`}
                      >
                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${config.deepAnalysisEnabled ? 'left-6' : 'left-1'}`} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Predictive Maint.</label>
                      <button 
                        onClick={() => setConfig({...config, predictiveMaintenance: !config.predictiveMaintenance})}
                        className={`w-10 h-5 rounded-full transition-colors relative ${config.predictiveMaintenance ? 'bg-amber-500' : 'bg-white/10'}`}
                      >
                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${config.predictiveMaintenance ? 'left-6' : 'left-1'}`} />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Anomaly Sens.</label>
                      <input 
                        type="number" 
                        step="0.1"
                        value={config.aiAnomalySensitivity}
                        onChange={(e) => setConfig({...config, aiAnomalySensitivity: parseFloat(e.target.value)})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-amber-500/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Sampling Rate</label>
                      <input 
                        type="number" 
                        value={config.aiDataSamplingRate}
                        onChange={(e) => setConfig({...config, aiDataSamplingRate: parseInt(e.target.value)})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-amber-500/50"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Auto Chain Switch</label>
                      <button 
                        onClick={() => setConfig({...config, autoSwitchChain: !config.autoSwitchChain})}
                        className={`w-10 h-5 rounded-full transition-colors relative ${config.autoSwitchChain ? 'bg-amber-500' : 'bg-white/10'}`}
                      >
                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${config.autoSwitchChain ? 'left-6' : 'left-1'}`} />
                      </button>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Profit Thresh.</label>
                      <input 
                        type="number" 
                        step="0.01"
                        value={config.profitabilityThreshold}
                        onChange={(e) => setConfig({...config, profitabilityThreshold: parseFloat(e.target.value)})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-amber-500/50"
                      />
                    </div>
                  </div>
                </div>

                {/* Economics & Payouts */}
                <div className="space-y-4">
                  <h3 className="text-[10px] font-mono text-purple-500 uppercase tracking-widest border-b border-purple-500/20 pb-1 flex items-center gap-2">
                    <TrendingUp className="w-3 h-3" /> Economics & Payouts
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Electricity Cost</label>
                      <input 
                        type="number" 
                        step="0.01"
                        value={config.electricityCost}
                        onChange={(e) => setConfig({...config, electricityCost: parseFloat(e.target.value)})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald-500/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Currency</label>
                      <select 
                        value={config.currency}
                        onChange={(e) => setConfig({...config, currency: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald-500/50"
                      >
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="BTC">BTC (₿)</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Pool Fee (%)</label>
                      <input 
                        type="number" 
                        step="0.1"
                        value={config.poolFee}
                        onChange={(e) => setConfig({...config, poolFee: parseFloat(e.target.value)})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald-500/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Dev Fee (%)</label>
                      <input 
                        type="number" 
                        step="0.1"
                        value={config.devFee}
                        onChange={(e) => setConfig({...config, devFee: parseFloat(e.target.value)})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald-500/50"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Hardware Cost</label>
                      <input 
                        type="number" 
                        value={config.hardwareCost}
                        onChange={(e) => setConfig({...config, hardwareCost: parseInt(e.target.value)})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald-500/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Amortization (mo)</label>
                      <input 
                        type="number" 
                        value={config.amortizationMonths}
                        onChange={(e) => setConfig({...config, amortizationMonths: parseInt(e.target.value)})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald-500/50"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Failover Pool 1</label>
                      <input 
                        type="text" 
                        value={config.failoverPool1}
                        onChange={(e) => setConfig({...config, failoverPool1: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald-500/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Failover Pool 2</label>
                      <input 
                        type="text" 
                        value={config.failoverPool2}
                        onChange={(e) => setConfig({...config, failoverPool2: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald-500/50"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Failover Pool 3</label>
                      <input 
                        type="text" 
                        value={config.poolFailover3}
                        onChange={(e) => setConfig({...config, poolFailover3: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald-500/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Failover Pool 4</label>
                      <input 
                        type="text" 
                        value={config.poolFailover4}
                        onChange={(e) => setConfig({...config, poolFailover4: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald-500/50"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Pool Selection Logic</label>
                    <select 
                      value={config.poolSelectionLogic}
                      onChange={(e) => setConfig({...config, poolSelectionLogic: e.target.value as any})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald-500/50"
                    >
                      <option value="Priority">Priority</option>
                      <option value="LoadBalance">Load Balance</option>
                      <option value="Latency">Lowest Latency</option>
                    </select>
                  </div>
                </div>

                {/* Security & Access */}
                <div className="space-y-4">
                  <h3 className="text-[10px] font-mono text-red-500 uppercase tracking-widest border-b border-red-500/20 pb-1 flex items-center gap-2">
                    <Shield className="w-3 h-3" /> Security & Access
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Web Password</label>
                      <input 
                        type="password" 
                        value={config.webPassword}
                        onChange={(e) => setConfig({...config, webPassword: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald-500/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Firewall Level</label>
                      <select 
                        value={config.firewallLevel}
                        onChange={(e) => setConfig({...config, firewallLevel: e.target.value as 'Low' | 'Medium' | 'High'})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald-500/50"
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">API Key</label>
                      <input 
                        type="text" 
                        value={config.apiKey}
                        onChange={(e) => setConfig({...config, apiKey: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald-500/50"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">SSH Enabled</label>
                      <button 
                        onClick={() => setConfig({...config, sshEnabled: !config.sshEnabled})}
                        className={`w-10 h-5 rounded-full transition-colors relative ${config.sshEnabled ? 'bg-emerald-500' : 'bg-white/10'}`}
                      >
                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${config.sshEnabled ? 'left-6' : 'left-1'}`} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">2FA Auth</label>
                      <button 
                        onClick={() => setConfig({...config, twoFactorAuth: !config.twoFactorAuth})}
                        className={`w-10 h-5 rounded-full transition-colors relative ${config.twoFactorAuth ? 'bg-emerald-500' : 'bg-white/10'}`}
                      >
                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${config.twoFactorAuth ? 'left-6' : 'left-1'}`} />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">KYC Status</label>
                      <select 
                        value={config.kycStatus}
                        onChange={(e) => setConfig({...config, kycStatus: e.target.value as any})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald-500/50"
                      >
                        <option value="Not Required">Not Required</option>
                        <option value="Pending">Pending</option>
                        <option value="Verified">Verified</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Data Residency</label>
                      <select 
                        value={config.dataResidency}
                        onChange={(e) => setConfig({...config, dataResidency: e.target.value as any})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald-500/50"
                      >
                        <option value="Local">Local</option>
                        <option value="EU">EU</option>
                        <option value="US">US</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">SSH Port</label>
                      <input 
                        type="number" 
                        value={config.sshPort}
                        onChange={(e) => setConfig({...config, sshPort: parseInt(e.target.value)})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-red-500/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">HTTP Port</label>
                      <input 
                        type="number" 
                        value={config.httpPort}
                        onChange={(e) => setConfig({...config, httpPort: parseInt(e.target.value)})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-red-500/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">API Port</label>
                      <input 
                        type="number" 
                        value={config.apiPort}
                        onChange={(e) => setConfig({...config, apiPort: parseInt(e.target.value)})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-red-500/50"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">IP Whitelist (CIDR)</label>
                    <input 
                      type="text" 
                      placeholder="192.168.1.0/24"
                      value={config.ipWhitelist}
                      onChange={(e) => setConfig({...config, ipWhitelist: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-red-500/50"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">SSH Root Login</label>
                      <button 
                        onClick={() => setConfig({...config, enableSshRootLogin: !config.enableSshRootLogin})}
                        className={`w-10 h-5 rounded-full transition-colors relative ${config.enableSshRootLogin ? 'bg-red-500' : 'bg-white/10'}`}
                      >
                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${config.enableSshRootLogin ? 'left-6' : 'left-1'}`} />
                      </button>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">API Token Exp. (s)</label>
                      <input 
                        type="number" 
                        value={config.apiTokenExpiry}
                        onChange={(e) => setConfig({...config, apiTokenExpiry: parseInt(e.target.value)})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-red-500/50"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Enable CORS</label>
                      <button 
                        onClick={() => setConfig({...config, enableCors: !config.enableCors})}
                        className={`w-10 h-5 rounded-full transition-colors relative ${config.enableCors ? 'bg-red-500' : 'bg-white/10'}`}
                      >
                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${config.enableCors ? 'left-6' : 'left-1'}`} />
                      </button>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Max API Req/Min</label>
                      <input 
                        type="number" 
                        value={config.maxApiRequestsPerMinute}
                        onChange={(e) => setConfig({...config, maxApiRequestsPerMinute: parseInt(e.target.value)})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-red-500/50"
                      />
                    </div>
                  </div>
                </div>

                {/* Monitoring & Alerts */}
                <div className="space-y-4">
                  <h3 className="text-[10px] font-mono text-orange-500 uppercase tracking-widest border-b border-orange-500/20 pb-1 flex items-center gap-2">
                    <Globe className="w-3 h-3" /> Monitoring & Alerts
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Logging Level</label>
                      <select 
                        value={config.loggingLevel}
                        onChange={(e) => setConfig({...config, loggingLevel: e.target.value as any})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald-500/50"
                      >
                        <option value="Debug">Debug</option>
                        <option value="Info">Info</option>
                        <option value="Warning">Warning</option>
                        <option value="Error">Error</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Stats Interval (s)</label>
                      <input 
                        type="number" 
                        value={config.statsInterval}
                        onChange={(e) => setConfig({...config, statsInterval: parseInt(e.target.value)})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald-500/50"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Email Alerts</label>
                      <button 
                        onClick={() => setConfig({...config, emailAlerts: !config.emailAlerts})}
                        className={`w-10 h-5 rounded-full transition-colors relative ${config.emailAlerts ? 'bg-emerald-500' : 'bg-white/10'}`}
                      >
                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${config.emailAlerts ? 'left-6' : 'left-1'}`} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">SMS Alerts</label>
                      <button 
                        onClick={() => setConfig({...config, smsAlerts: !config.smsAlerts})}
                        className={`w-10 h-5 rounded-full transition-colors relative ${config.smsAlerts ? 'bg-emerald-500' : 'bg-white/10'}`}
                      >
                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${config.smsAlerts ? 'left-6' : 'left-1'}`} />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Discord Webhook</label>
                    <input 
                      type="text" 
                      placeholder="https://discord.com/api/webhooks/..."
                      value={config.discordWebhook}
                      onChange={(e) => setConfig({...config, discordWebhook: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald-500/50"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">CSV Export</label>
                      <button 
                        onClick={() => setConfig({...config, csvExportEnabled: !config.csvExportEnabled})}
                        className={`w-10 h-5 rounded-full transition-colors relative ${config.csvExportEnabled ? 'bg-emerald-500' : 'bg-white/10'}`}
                      >
                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${config.csvExportEnabled ? 'left-6' : 'left-1'}`} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">JSON API</label>
                      <button 
                        onClick={() => setConfig({...config, jsonApiEnabled: !config.jsonApiEnabled})}
                        className={`w-10 h-5 rounded-full transition-colors relative ${config.jsonApiEnabled ? 'bg-emerald-500' : 'bg-white/10'}`}
                      >
                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${config.jsonApiEnabled ? 'left-6' : 'left-1'}`} />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Report Freq.</label>
                      <select 
                        value={config.reportFrequency}
                        onChange={(e) => setConfig({...config, reportFrequency: e.target.value as any})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald-500/50"
                      >
                        <option value="Daily">Daily</option>
                        <option value="Weekly">Weekly</option>
                        <option value="Monthly">Monthly</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Retention (Days)</label>
                      <input 
                        type="number" 
                        value={config.dataRetentionDays}
                        onChange={(e) => setConfig({...config, dataRetentionDays: parseInt(e.target.value)})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald-500/50"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">InfluxDB URL</label>
                    <input 
                      type="text" 
                      placeholder="http://influxdb:8086"
                      value={config.influxDbUrl}
                      onChange={(e) => setConfig({...config, influxDbUrl: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald-500/50"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Log Retention (d)</label>
                      <input 
                        type="number" 
                        value={config.logRetentionDays}
                        onChange={(e) => setConfig({...config, logRetentionDays: parseInt(e.target.value)})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald-500/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Log Level (File)</label>
                      <select 
                        value={config.logLevelFile}
                        onChange={(e) => setConfig({...config, logLevelFile: e.target.value as any})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald-500/50"
                      >
                        <option value="Debug">Debug</option>
                        <option value="Info">Info</option>
                        <option value="Warning">Warning</option>
                        <option value="Error">Error</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Syslog</label>
                      <button 
                        onClick={() => setConfig({...config, enableSyslog: !config.enableSyslog})}
                        className={`w-10 h-5 rounded-full transition-colors relative ${config.enableSyslog ? 'bg-emerald-500' : 'bg-white/10'}`}
                      >
                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${config.enableSyslog ? 'left-6' : 'left-1'}`} />
                      </button>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Syslog Server</label>
                      <input 
                        type="text" 
                        placeholder="syslog.local:514"
                        value={config.syslogServer}
                        onChange={(e) => setConfig({...config, syslogServer: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald-500/50"
                      />
                    </div>
                  </div>
                </div>

                {/* Advanced */}
                <div className="space-y-4">
                  <h3 className="text-[10px] font-mono text-white/60 uppercase tracking-widest border-b border-white/10 pb-1 flex items-center gap-2">
                    <Settings className="w-3 h-3" /> Advanced
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Stratum V2</label>
                      <button 
                        onClick={() => setConfig({...config, stratumV2: !config.stratumV2})}
                        className={`w-10 h-5 rounded-full transition-colors relative ${config.stratumV2 ? 'bg-emerald-500' : 'bg-white/10'}`}
                      >
                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${config.stratumV2 ? 'left-6' : 'left-1'}`} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Extra Nonce</label>
                      <button 
                        onClick={() => setConfig({...config, extraNonce: !config.extraNonce})}
                        className={`w-10 h-5 rounded-full transition-colors relative ${config.extraNonce ? 'bg-emerald-500' : 'bg-white/10'}`}
                      >
                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${config.extraNonce ? 'left-6' : 'left-1'}`} />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Proxy URL</label>
                      <input 
                        type="text" 
                        placeholder="socks5://user:pass@host:port"
                        value={config.proxyUrl}
                        onChange={(e) => setConfig({...config, proxyUrl: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald-500/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Difficulty</label>
                      <input 
                        type="number" 
                        value={config.difficulty}
                        onChange={(e) => setConfig({...config, difficulty: parseInt(e.target.value)})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald-500/50"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Quiet Hours</label>
                      <button 
                        onClick={() => setConfig({...config, quietHoursEnabled: !config.quietHoursEnabled})}
                        className={`w-10 h-5 rounded-full transition-colors relative ${config.quietHoursEnabled ? 'bg-emerald-500' : 'bg-white/10'}`}
                      >
                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${config.quietHoursEnabled ? 'left-6' : 'left-1'}`} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Peak Throttle</label>
                      <button 
                        onClick={() => setConfig({...config, peakHoursThrottle: !config.peakHoursThrottle})}
                        className={`w-10 h-5 rounded-full transition-colors relative ${config.peakHoursThrottle ? 'bg-emerald-500' : 'bg-white/10'}`}
                      >
                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${config.peakHoursThrottle ? 'left-6' : 'left-1'}`} />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Auto Reboot</label>
                      <button 
                        onClick={() => setConfig({...config, autoRebootLowHashrate: !config.autoRebootLowHashrate})}
                        className={`w-10 h-5 rounded-full transition-colors relative ${config.autoRebootLowHashrate ? 'bg-emerald-500' : 'bg-white/10'}`}
                      >
                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${config.autoRebootLowHashrate ? 'left-6' : 'left-1'}`} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Auto Update</label>
                      <button 
                        onClick={() => setConfig({...config, autoUpdateFirmware: !config.autoUpdateFirmware})}
                        className={`w-10 h-5 rounded-full transition-colors relative ${config.autoUpdateFirmware ? 'bg-emerald-500' : 'bg-white/10'}`}
                      >
                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${config.autoUpdateFirmware ? 'left-6' : 'left-1'}`} />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Stratum UA</label>
                      <input 
                        type="text" 
                        value={config.stratumUserAgent}
                        onChange={(e) => setConfig({...config, stratumUserAgent: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald-500/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Ping Int. (s)</label>
                      <input 
                        type="number" 
                        value={config.stratumPingInterval}
                        onChange={(e) => setConfig({...config, stratumPingInterval: parseInt(e.target.value)})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald-500/50"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Kernel Reboot</label>
                      <button 
                        onClick={() => setConfig({...config, rebootOnKernelPanic: !config.rebootOnKernelPanic})}
                        className={`w-10 h-5 rounded-full transition-colors relative ${config.rebootOnKernelPanic ? 'bg-emerald-500' : 'bg-white/10'}`}
                      >
                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${config.rebootOnKernelPanic ? 'left-6' : 'left-1'}`} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">HW Watchdog</label>
                      <button 
                        onClick={() => setConfig({...config, hardwareWatchdogEnabled: !config.hardwareWatchdogEnabled})}
                        className={`w-10 h-5 rounded-full transition-colors relative ${config.hardwareWatchdogEnabled ? 'bg-emerald-500' : 'bg-white/10'}`}
                      >
                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${config.hardwareWatchdogEnabled ? 'left-6' : 'left-1'}`} />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Watchdog Timeout</label>
                      <input 
                        type="number" 
                        value={config.watchdogTimeout}
                        onChange={(e) => setConfig({...config, watchdogTimeout: parseInt(e.target.value)})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald-500/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Error Thresh.</label>
                      <input 
                        type="number" 
                        value={config.errorThreshold}
                        onChange={(e) => setConfig({...config, errorThreshold: parseInt(e.target.value)})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald-500/50"
                      />
                    </div>
                  </div>
                </div>

                {/* Hardware Lifecycle & Maintenance */}
                <div className="space-y-4 pt-4 border-t border-white/5">
                  <h3 className="text-[10px] font-mono text-blue-500 uppercase tracking-widest border-b border-blue-500/20 pb-1 flex items-center gap-2">
                    <ChipIcon className="w-3 h-3" /> Hardware Lifecycle & Maintenance
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Warranty Expiry</label>
                      <input 
                        type="date" 
                        value={config.warrantyExpiryDate}
                        onChange={(e) => setConfig({...config, warrantyExpiryDate: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-blue-500/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Total Runtime (h)</label>
                      <input 
                        type="number" 
                        value={config.totalRuntimeHours}
                        readOnly
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none text-white/40 cursor-not-allowed"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Maint. Interval (d)</label>
                      <input 
                        type="number" 
                        value={config.maintenanceReminderInterval}
                        onChange={(e) => setConfig({...config, maintenanceReminderInterval: parseInt(e.target.value)})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-blue-500/50"
                      />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Dust Sensor</label>
                      <button 
                        onClick={() => setConfig({...config, dustSensorEnabled: !config.dustSensorEnabled})}
                        className={`w-10 h-5 rounded-full transition-colors relative ${config.dustSensorEnabled ? 'bg-blue-500' : 'bg-white/10'}`}
                      >
                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${config.dustSensorEnabled ? 'left-6' : 'left-1'}`} />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Technician Email</label>
                    <input 
                      type="email" 
                      value={config.technicianContactEmail}
                      onChange={(e) => setConfig({...config, technicianContactEmail: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-blue-500/50"
                    />
                  </div>
                </div>

                {/* Power & Environment */}
                <div className="space-y-4 pt-4 border-t border-white/5">
                  <h3 className="text-[10px] font-mono text-emerald-500 uppercase tracking-widest border-b border-emerald-500/20 pb-1 flex items-center gap-2">
                    <Zap className="w-3 h-3" /> Power & Environment
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Phase Balancing</label>
                      <button 
                        onClick={() => setConfig({...config, psuPhaseBalancing: !config.psuPhaseBalancing})}
                        className={`w-10 h-5 rounded-full transition-colors relative ${config.psuPhaseBalancing ? 'bg-emerald-500' : 'bg-white/10'}`}
                      >
                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${config.psuPhaseBalancing ? 'left-6' : 'left-1'}`} />
                      </button>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">PFC Factor</label>
                      <input 
                        type="number" 
                        step="0.01"
                        value={config.powerFactorCorrection}
                        onChange={(e) => setConfig({...config, powerFactorCorrection: parseFloat(e.target.value)})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald-500/50"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">UPS Integration</label>
                      <button 
                        onClick={() => setConfig({...config, upsIntegrationEnabled: !config.upsIntegrationEnabled})}
                        className={`w-10 h-5 rounded-full transition-colors relative ${config.upsIntegrationEnabled ? 'bg-emerald-500' : 'bg-white/10'}`}
                      >
                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${config.upsIntegrationEnabled ? 'left-6' : 'left-1'}`} />
                      </button>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">UPS Battery Thresh.</label>
                      <input 
                        type="number" 
                        value={config.upsBatteryThreshold}
                        onChange={(e) => setConfig({...config, upsBatteryThreshold: parseInt(e.target.value)})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald-500/50"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Smoke Detector</label>
                      <button 
                        onClick={() => setConfig({...config, smokeDetectorIntegration: !config.smokeDetectorIntegration})}
                        className={`w-10 h-5 rounded-full transition-colors relative ${config.smokeDetectorIntegration ? 'bg-emerald-500' : 'bg-white/10'}`}
                      >
                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${config.smokeDetectorIntegration ? 'left-6' : 'left-1'}`} />
                      </button>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Energy Source</label>
                      <select 
                        value={config.energySource}
                        onChange={(e) => setConfig({...config, energySource: e.target.value as any})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald-500/50"
                      >
                        <option value="Grid">Grid</option>
                        <option value="Solar">Solar</option>
                        <option value="Wind">Wind</option>
                        <option value="Hydro">Hydro</option>
                        <option value="Nuclear">Nuclear</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Power & Environment */}
                <div className="space-y-4 pt-4 border-t border-white/5">
                  <h3 className="text-[10px] font-mono text-emerald-500 uppercase tracking-widest border-b border-emerald-500/20 pb-1 flex items-center gap-2">
                    <Zap className="w-3 h-3" /> Power & Environment
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Phase Balancing</label>
                      <button 
                        onClick={() => setConfig({...config, psuPhaseBalancing: !config.psuPhaseBalancing})}
                        className={`w-10 h-5 rounded-full transition-colors relative ${config.psuPhaseBalancing ? 'bg-emerald-500' : 'bg-white/10'}`}
                      >
                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${config.psuPhaseBalancing ? 'left-6' : 'left-1'}`} />
                      </button>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">PFC Factor</label>
                      <input 
                        type="number" 
                        step="0.01"
                        value={config.powerFactorCorrection}
                        onChange={(e) => setConfig({...config, powerFactorCorrection: parseFloat(e.target.value)})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald-500/50"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">UPS Integration</label>
                      <button 
                        onClick={() => setConfig({...config, upsIntegrationEnabled: !config.upsIntegrationEnabled})}
                        className={`w-10 h-5 rounded-full transition-colors relative ${config.upsIntegrationEnabled ? 'bg-emerald-500' : 'bg-white/10'}`}
                      >
                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${config.upsIntegrationEnabled ? 'left-6' : 'left-1'}`} />
                      </button>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">UPS Battery Thresh.</label>
                      <input 
                        type="number" 
                        value={config.upsBatteryThreshold}
                        onChange={(e) => setConfig({...config, upsBatteryThreshold: parseInt(e.target.value)})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald-500/50"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Smoke Detector</label>
                      <button 
                        onClick={() => setConfig({...config, smokeDetectorIntegration: !config.smokeDetectorIntegration})}
                        className={`w-10 h-5 rounded-full transition-colors relative ${config.smokeDetectorIntegration ? 'bg-emerald-500' : 'bg-white/10'}`}
                      >
                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${config.smokeDetectorIntegration ? 'left-6' : 'left-1'}`} />
                      </button>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Energy Source</label>
                      <select 
                        value={config.energySource}
                        onChange={(e) => setConfig({...config, energySource: e.target.value as any})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald-500/50"
                      >
                        <option value="Grid">Grid</option>
                        <option value="Solar">Solar</option>
                        <option value="Wind">Wind</option>
                        <option value="Hydro">Hydro</option>
                        <option value="Nuclear">Nuclear</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* UI & Personalization */}
                <div className="space-y-4">
                  <h3 className="text-[10px] font-mono text-emerald-500 uppercase tracking-widest border-b border-emerald-500/20 pb-1 flex items-center gap-2">
                    <Eye className="w-3 h-3" /> UI & Personalization
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Theme</label>
                      <select 
                        value={config.theme}
                        onChange={(e) => setConfig({...config, theme: e.target.value as any})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald-500/50"
                      >
                        <option value="Cyberpunk">Cyberpunk</option>
                        <option value="Minimal">Minimal</option>
                        <option value="Classic">Classic</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Language</label>
                      <select 
                        value={config.language}
                        onChange={(e) => setConfig({...config, language: e.target.value as any})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald-500/50"
                      >
                        <option value="EN">English</option>
                        <option value="FR">Français</option>
                        <option value="ES">Español</option>
                        <option value="DE">Deutsch</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">User Role</label>
                      <select 
                        value={config.userRole}
                        onChange={(e) => setConfig({...config, userRole: e.target.value as any})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald-500/50"
                      >
                        <option value="Admin">Admin</option>
                        <option value="Operator">Operator</option>
                        <option value="Viewer">Viewer</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Session Timeout (s)</label>
                      <input 
                        type="number" 
                        value={config.sessionTimeout}
                        onChange={(e) => setConfig({...config, sessionTimeout: parseInt(e.target.value)})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald-500/50"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Font Size</label>
                      <input 
                        type="number" 
                        value={config.fontSize}
                        onChange={(e) => setConfig({...config, fontSize: parseInt(e.target.value)})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald-500/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Color Blind</label>
                      <select 
                        value={config.colorBlindMode}
                        onChange={(e) => setConfig({...config, colorBlindMode: e.target.value as any})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald-500/50"
                      >
                        <option value="None">None</option>
                        <option value="Protanopia">Protanopia</option>
                        <option value="Deuteranopia">Deuteranopia</option>
                        <option value="Tritanopia">Tritanopia</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Voice Cmds</label>
                      <button 
                        onClick={() => setConfig({...config, voiceCommandsEnabled: !config.voiceCommandsEnabled})}
                        className={`w-10 h-5 rounded-full transition-colors relative ${config.voiceCommandsEnabled ? 'bg-emerald-500' : 'bg-white/10'}`}
                      >
                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${config.voiceCommandsEnabled ? 'left-6' : 'left-1'}`} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Debug Mode</label>
                      <button 
                        onClick={() => setConfig({...config, debugModeEnabled: !config.debugModeEnabled})}
                        className={`w-10 h-5 rounded-full transition-colors relative ${config.debugModeEnabled ? 'bg-emerald-500' : 'bg-white/10'}`}
                      >
                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${config.debugModeEnabled ? 'left-6' : 'left-1'}`} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-white/10 bg-black/20 flex justify-end">
                <button 
                  onClick={() => setShowSettings(false)}
                  className="px-8 py-3 bg-emerald-500 text-black text-xs font-bold rounded-full hover:bg-emerald-400 transition-colors"
                >
                  SAVE CONFIGURATION
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Sub-components ---

function StatCard({ label, value, icon, trend, isPositive }: { 
  label: string; 
  value: string; 
  icon: React.ReactNode; 
  trend: string;
  isPositive: boolean;
}) {
  return (
    <div className="bg-black/40 border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-colors group">
      <div className="flex items-center justify-between mb-3">
        <div className="p-2 bg-white/5 rounded-lg text-white/60 group-hover:text-emerald-500 transition-colors">
          {icon}
        </div>
        <div className={`flex items-center gap-1 text-[10px] font-mono ${isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
          {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {trend}
        </div>
      </div>
      <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-xl font-mono font-medium">{value}</p>
    </div>
  );
}
