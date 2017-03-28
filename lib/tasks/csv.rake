namespace :csv do

  task :run => :environment do
    DataForCsv::Main.run('survey')
  end
end
