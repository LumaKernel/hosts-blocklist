If (-NOT ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
  $arguments = "& '" + $MyInvocation.MyCommand.Definition + "'"
  Start-Process powershell -Verb runAs -ArgumentList $arguments
  Break
}

$hosts_path = "C:\Windows\System32\Drivers\etc\hosts"
nvim.exe $hosts_path
