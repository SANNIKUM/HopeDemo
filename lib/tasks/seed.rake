namespace :seed do

  task :ui_items_complete => :environment do
    Seed::UiItems::Main.complete
  end

  task :ui_items_part => :environment do
    Seed::UiItems::Main.part
  end

  task :access_sets => :environment do
    Seed::AccessSets.run
  end

  task :access_sets => :environment do
    Seed::AccessSets.run
  end

  task :expected_fields => :environment do
    Seed::ExpectedFields.run
  end

  task :route_geometry_clear_and_run => :environment do
    Seed::RouteGeometry.clear_and_run
  end

  task :delete_all => :environment do
    Seed::Delete.run
  end

  task :teams => :environment do
    Seed::Teams.run
  end

  task :sf_route_geometry => :environment do
    Seed::RouteGeometry.sf
  end

  task :switch_based_check_outs => :environment do
    Seed::SwitchBasedCheckOuts.run
  end

  task :automatic_assignments => :environment do
    Seed::AutomaticAssignments.run
  end

  task :automatic_assignment_form_values => :environment do
    Seed::AutomaticAssignmentFormValues.run
  end

  task :automata => :environment do
    Seed::AutomaticAssignments.run
    Seed::SwitchBasedCheckOuts.run
    Seed::AutomaticAssignmentFormValues.run
  end


  task :all => :environment do
    Seed::All.run
  end

end
