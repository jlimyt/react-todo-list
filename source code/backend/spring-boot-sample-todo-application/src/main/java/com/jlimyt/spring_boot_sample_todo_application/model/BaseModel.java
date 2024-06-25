package com.jlimyt.spring_boot_sample_todo_application.model;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.hibernate.annotations.Comment;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.Transient;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@MappedSuperclass
public class BaseModel<T> implements Serializable {
  private static final long serialVersionUID = 922329958577935515L;
  
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  protected T id;
  
  @JsonIgnore
  @Column(name = "created_by", nullable = false, precision = 19)
  protected Long createdBy;
  
  @JsonIgnore
  @Column(name = "modified_by", nullable = false, precision = 19)
  protected Long modifiedBy;
  
  @Column(name = "created_at", nullable = false)
  @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
  @JsonSerialize(using = LocalDateTimeSerializer.class)
  @JsonDeserialize(using = LocalDateTimeDeserializer.class)
  @JsonFormat(pattern = "dd/MM/yyyy HH:mm")
  protected LocalDateTime createdAt;
  
  @Column(name = "modified_at", nullable = false)
  @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
  @JsonSerialize(using = LocalDateTimeSerializer.class)
  @JsonDeserialize(using = LocalDateTimeDeserializer.class)
  @JsonFormat(pattern = "dd/MM/yyyy HH:mm")
  protected LocalDateTime modifiedAt;

  @Column
  @Schema(description = "Record is active or not")
  @Comment("Record is active or not")
  @Builder.Default
  private Boolean active=true;
	

  public void setSortOrder(String sortOrder) {
    this.sortOrder = sortOrder;
  }
  
  public void setSortFields(List<String> sortFields) {
    this.sortFields = sortFields;
  }
  
  @JsonDeserialize(using = LocalDateTimeDeserializer.class)
  @JsonFormat(pattern = "dd/MM/yyyy HH:mm")
  public void setModifiedAt(LocalDateTime modifiedAt) {
    this.modifiedAt = modifiedAt;
  }
  
  @JsonDeserialize(using = LocalDateTimeDeserializer.class)
  @JsonFormat(pattern = "dd/MM/yyyy HH:mm")
  public void setCreatedAt(LocalDateTime createdAt) {
    this.createdAt = createdAt;
  }
  
  @JsonIgnore
  public void setModifiedBy(Long modifiedBy) {
    this.modifiedBy = modifiedBy;
  }
  
  @JsonIgnore
  public void setCreatedBy(Long createdBy) {
    this.createdBy = createdBy;
  }
  
  public void setId(T id) {
    this.id = id;
  }
  
  public String getSortOrder() {
    return this.sortOrder;
  }
  
  public List<String> getSortFields() {
    return this.sortFields;
  }  
 
  public Pagination getPagination() {
	    return this.pagination;
  }
  
  public LocalDateTime getModifiedAt() {
    return this.modifiedAt;
  }
  
  public LocalDateTime getCreatedAt() {
    return this.createdAt;
  }
  
  public Long getModifiedBy() {
    return this.modifiedBy;
  }
  
  public Long getCreatedBy() {
    return this.createdBy;
  }
  
  public T getId() {
    return this.id;
  }
 
  protected transient Pagination pagination = new Pagination();
 
  protected transient List<String> sortFields = Arrays.asList(new String[] { "id" });
  
  protected transient String sortOrder = "ascend";
  
  @Transient
  public Sort.Direction getSortDirection() {
    return StringUtils.equals(getSortOrder(), "ascend") ? Sort.Direction.ASC : 
      Sort.Direction.DESC;
  }
}
