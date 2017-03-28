require 'rails_helper'

describe ComposeProc do

  def subject(*args)
    ComposeProc.proc(*args)
  end

  def proc1
    lambda do |n|
      n+1
    end
  end

  def proc2
    lambda do |n|
      n*3
    end
  end

  module Module1
    def self.run(n)
      n*3
    end
  end

  it 'works for one proc' do
    result = subject(proc1).call(2)
    expect(result).to eq(3)
  end

  it 'works for two procs' do
    result = subject(proc1, proc2).call(2)
    expect(result).to eq(7)
  end

  it 'works for a proc and a module' do
    result = subject(proc1, Module1).call(2)
    expect(result).to eq(7)
  end
end
