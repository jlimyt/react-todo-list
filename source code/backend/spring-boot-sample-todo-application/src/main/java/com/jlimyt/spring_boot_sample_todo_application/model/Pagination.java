package com.jlimyt.spring_boot_sample_todo_application.model;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class Pagination {
  public Integer getCurrent() {
    return this.current;
  }
  
  public Integer getPageSize() {
    return this.pageSize;
  }
  
  public void setCurrent(Integer current) {
    this.current = current;
  }
  
  public void setPageSize(Integer pageSize) {
    this.pageSize = pageSize;
  }
  protected Integer current = Integer.valueOf(1);
  
  protected Integer pageSize = Integer.valueOf(10);
}
