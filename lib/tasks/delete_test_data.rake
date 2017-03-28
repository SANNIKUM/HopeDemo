namespace :test_data do
  desc 'destroy'

  task :destroy => :environment do
    destroy_test_data
  end

  def destroy_test_data
    self.form_types.each do |ft|
      form_type = AssignmentType.find_by name: 'formType'
      survey_asg = Assignment.find_by(name: ft, assignment_type: form_type)
      fvos = FormValueOption.where(assignment_id: survey_asg)
      fvs = FormValue.where(form_value_option: fvos)
      sfs = SubmittedForm.where(id: fvs.map(&:submitted_form_id))
      all_fvs = FormValue.where(submitted_form_id: sfs.map(&:id))
      all_fvs.delete_all
      sfs.delete_all
    end
  end

  private

  def self.form_types
    %w(
      survey
      routeCheckIn
      routeCheckOut
    )
  end
end
