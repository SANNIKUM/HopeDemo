module Seed::All

  def self.run
    Seed::Delete.run
    Seed::Assignments.run
    Seed::UiItems::Main.complete
    Seed::AccessSets.run
    Seed::AutomaticAssignments.run
    Seed::ExpectedFields.run
    Seed::Teams.run
    Seed::RouteGeometry.run
    Seed::SwitchBasedCheckOuts.run
    Seed::AutomaticAssignmentFormValues.run
  end

end
