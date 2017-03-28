require 'rails_helper'

describe Caller do

  def subject(mod_or_proc, *args)
    Caller.run(mod_or_proc, *args)
  end

  module Module1
    def self.run(arg1, arg2)
      arg1*2 + arg2
    end
  end

  def proc1
    lambda do |arg1, arg2|
      arg1*2 + arg2
    end
  end

  it 'works for module' do
    result = subject(Module1, 2, 3)
    expect(result).to eq(7)
  end

  it 'works for proc' do
    result = subject(proc1, 2, 3)
    expect(result).to eq(7)
  end

end
