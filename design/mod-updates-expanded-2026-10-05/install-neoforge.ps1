param(
    [Parameter(Mandatory = $true)]
    [string]$MinecraftRoot,
    [string]$JavaPath = 'java'
)

$ErrorActionPreference = 'Stop'
$targetRoot = [System.IO.Path]::GetFullPath($MinecraftRoot)
if (-not (Test-Path -LiteralPath $targetRoot -PathType Container)) {
    throw "Minecraft 根目录不存在：$targetRoot"
}
$javaCommand = Get-Command $JavaPath -ErrorAction Stop
$javaProbe = New-Object System.Diagnostics.Process
$javaProbe.StartInfo.FileName = $javaCommand.Source
$javaProbe.StartInfo.Arguments = '-version'
$javaProbe.StartInfo.UseShellExecute = $false
$javaProbe.StartInfo.CreateNoWindow = $true
$javaProbe.StartInfo.RedirectStandardError = $true
$javaProbe.StartInfo.RedirectStandardOutput = $true
[void]$javaProbe.Start()
$javaInfo = $javaProbe.StandardError.ReadToEnd() + $javaProbe.StandardOutput.ReadToEnd()
$javaProbe.WaitForExit()
$javaProbe.Dispose()
if ($javaInfo -notmatch 'version "(\d+)') {
    throw '无法识别 Java 版本；请通过 -JavaPath 指定 Java 21。'
}
if ([int]$Matches[1] -lt 21) {
    throw '需要 Java 21 或更高版本。游戏建议使用 Java 21。'
}

$installerUrl = 'https://maven.neoforged.net/releases/net/neoforged/neoforge/21.1.255/neoforge-21.1.255-installer.jar'
$expectedHash = '811972359d319ee753cc8be7d837235a60a5e9b07d65f4aa79181de470717da5ba246aced451f60d233924bc60c9552ed6ec3e4afab43204e1624c90556ae844'
$installerPath = Join-Path ([System.IO.Path]::GetTempPath()) 'path-of-creation-neoforge-21.1.255-installer.jar'
if (-not (Test-Path -LiteralPath $installerPath) -or (Get-FileHash -LiteralPath $installerPath -Algorithm SHA512).Hash.ToLowerInvariant() -ne $expectedHash) {
    Invoke-WebRequest -Uri $installerUrl -OutFile $installerPath
}
if ((Get-FileHash -LiteralPath $installerPath -Algorithm SHA512).Hash.ToLowerInvariant() -ne $expectedHash) {
    throw 'NeoForge 安装器 SHA512 校验失败。'
}

# 官方安装器仅安装加载器与运行库；整合包配置、mods 和存档不由此脚本复制。
& $javaCommand.Source '-Djava.net.preferIPv4Stack=true' -jar $installerPath --install-client $targetRoot
if ($LASTEXITCODE -ne 0) {
    throw "NeoForge 安装失败，退出码：$LASTEXITCODE"
}
Write-Output 'NeoForge 21.1.255 已安装。请用整合包中的新版启动描述文件和 Java 21 启动。'
