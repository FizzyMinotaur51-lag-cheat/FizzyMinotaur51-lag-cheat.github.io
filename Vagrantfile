Vagrant.configure(2) do |config|
  vagrant_version = Vagrant::VERSION.sub(/^v/, '')
  config.env.enable
  config.vm.hostname = "fizzy-jekyll"
  config.vm.box = "ubuntu/trusty64"

  config.vm.provision "fix-no-tty", type: "shell" do |s|
    s.privileged = false
    s.binary = true
    s.inline = "sudo sed -i '/tty/!s/mesg n/tty -s \\&\\& mesg n/' /root/.profile"
  end

  # Jekyll dev port
  config.vm.network "forwarded_port", guest: 4000, host: 80, auto_correct: true
  # BrowserSync port
  config.vm.network "forwarded_port", guest: 3000, host: 3000, auto_correct: true
  # BrowserSync UI port
  config.vm.network "forwarded_port", guest: 3001, host: 3001, auto_correct: true
  # Netlify CMS Git API for authentication port
  config.vm.network "forwarded_port", guest: 8080, host: 8080, auto_correct: true

  if vagrant_version >= "1.3.0"
    config.vm.synced_folder "./", "/srv/www", create: true, :owner => "vagrant", :mount_options => [ "dmode=775", "fmode=774" ]
  else
    config.vm.synced_folder "./", "/srv/www", create: true, :owner => "vagrant", :extra => 'dmode=775,fmode=774'
  end
  # config.vm.synced_folder ".", "/vagrant", type: "rsync", rsync__exclude: ".git/"

  # VirtualBox-specific configuration
  config.vm.provider "virtualbox" do |v|
    v.customize ["modifyvm", :id, "--memory", 512]
    v.customize ["modifyvm", :id, "--natdnshostresolver1", "on"]
    v.customize ["modifyvm", :id, "--natdnsproxy1", "on"]
  end

  config.ssh.forward_agent = true

  config.vm.provision :shell, path: "provision.sh", privileged: false, binary: true
  # config.vm.provision :shell, path: "project.sh", privileged: false, binary: true
  #config.vm.provision :file, source: "~/.gitconfig", destination: ".gitconfig"

  # Change boot timeout
  config.vm.boot_timeout = 500
    
end
