module Serializers::UiItem::MainProc

  def self.proc
    lambda do |id, asg_ids|
      x = self.lift_and_compose_proc(
        self.form_field,
        self.computed_properties_proc,
        self.direct_properties
      ).call({id: id, assignment_ids: asg_ids})
      x.delete(:assignment_ids)
      x.merge(name: UiItem.find_by(id: id).name)
    end
  end

  private

  def self.lift_and_compose_proc(*args)
    LiftAndComposeProc.proc(*args)
  end

  def self.form_field
    Serializers::UiItem::FormField
  end

  def self.computed_properties_proc
    Serializers::UiItem::ComputedPropertiesProc.proc
  end

  def self.direct_properties
    Serializers::UiItem::DirectProperties
  end
end
