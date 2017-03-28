namespace :assign do
  task :users => :environment do
    assign_users
  end

  def assign_users
    siteType = AssignmentType.find_by(name: 'site')

    userType = AssignmentType.find_by name: 'user'
    art = AssignmentRelationType.find_or_create_by(
      name: 'User to Site',
      assignment_1_type: userType,
      assignment_2_type: siteType,
    )
    users = Assignment.where(assignment_type: userType)
    users_fvos = FormValueOption.where(assignment: users)
    users_fvs = FormValue.where(form_value_option: users_fvos)
    sites = Assignment.where(assignment_type: siteType)
    sites.each do |site|
      fvos = FormValueOption.where(assignment: site)
      fvs = FormValue.where(form_value_option: fvos)
      users_fvs_2 = users_fvs.where(submitted_form_id: fvs.map(&:submitted_form_id))
      users = users_fvs_2.map(&:form_value_option).map(&:assignment)
      assign_users_helper(users, site, art)
    end
  end

  def assign_users_helper(users, site, art)
    users.each do |user|
      AssignmentRelation.find_or_create_by(
        assignment_1: user,
        assignment_2: site,
        assignment_relation_type: art,
      )
    end
  end
end
