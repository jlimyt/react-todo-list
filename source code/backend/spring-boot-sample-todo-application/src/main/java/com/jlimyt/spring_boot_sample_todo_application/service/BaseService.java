package com.jlimyt.spring_boot_sample_todo_application.service;

import com.jlimyt.spring_boot_sample_todo_application.model.BaseModel;
import com.jlimyt.spring_boot_sample_todo_application.repository.BaseRepository;
import com.jlimyt.spring_boot_sample_todo_application.util.ObjectUtil;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.CrossOrigin;


@CrossOrigin({"*"})
public abstract class BaseService<M extends BaseModel<T>, T> {
  BaseRepository<M, T> baseRepository;
  
  public BaseService(BaseRepository<M, T> repository) {
    this.baseRepository = repository;
  }
  
  public Page<M> findAll(Pageable pageable) {
    return this.baseRepository.findAll(pageable);
  }
  
  public List<M> findAll() {
    preProcessAction();
    List<M> list = this.baseRepository.findAll();
    return list;
  }
  
  public List<M> findAll(Specification<M> specification) {
    preProcessAction();
    List<M> list = this.baseRepository.findAll(specification);
    return list;
  }
  
  public List<M> findAll(Sort sort) {
    preProcessAction();
    List<M> list = this.baseRepository.findAll(sort);
    return list;
  }
  
  public <S extends M> S save(S entity) {
    return save(entity, null);
  }
  
  public <S extends M> S save(S entity, Long transactionId) {
    preProcessAction();
    preProcessSave(entity);
    M entityInDb = null;
    if (entity.getId() != null)
      entityInDb = findById((T)entity.getId()); 
    ObjectUtil.updateModelWithCommonFields(entity, entityInDb, transactionId);
    ObjectUtil.updateCommonFields(entity);
    return (S)this.baseRepository.save(entity);
  }
  
  public <S extends M> List<S> saveAll(List<S> entities) {
    return saveAll(entities, null);
  }
  
  public <S extends M> List<S> saveAll(List<S> entities, Long transactionId) {
    Long finalTransactionId = transactionId;
    preProcessAction();
    entities.forEach(entity -> {
          preProcessSave((M)entity);
          M entityInDb = null;
          if (entity.getId() != null)
            entityInDb = findById((T)entity.getId()); 
          ObjectUtil.updateModelWithCommonFields(entity, entityInDb, finalTransactionId);
        });
    entities = this.baseRepository.saveAll(entities);
    return entities;
  }
  
  public M getOne(T id) {
    preProcessAction();
    return this.baseRepository.getReferenceById(id);
  }
  
  public M findById(T id) {
    preProcessAction();
    Optional<M> modelEo = this.baseRepository.findById(id);
    return modelEo.get();
  }
  
  @Transactional
  public <S extends M> S update(S entity) {
    preProcessAction();
    M entityInDb = null;
    if (entity.getId() != null)
      entityInDb = findById(entity.getId()); 
    preProcessUpdate(entity, entityInDb);
    ObjectUtil.updateModelWithCommonFields(entity, entityInDb, null);
    ObjectUtil.updateCommonFields(entity);
    return this.baseRepository.save(entity);
  }

  public void deleteById(T id) {
    deleteById(id, null);
  }
  
  public void deleteById(T id, Long transactionId) {
    preProcessAction();
    M entity = findById(id);
    preProcessDelete(entity);
    ObjectUtil.updateCommonFields(entity);
    entity.setActive(false);
    this.baseRepository.save(entity);
  }
  
  protected <S> void preProcessUpdateAction(S entity) {}
  
  protected <S> void preProcessSave(S entity) {
    preProcessUpdateAction(entity);
  }
  
  protected <S> void preProcessUpdate(S entity, S entityInDb) {
    preProcessUpdateAction(entity);
  }
  
  protected <S> void preProcessDelete(S entity) {
    preProcessUpdateAction(entity);
  }
  
  public Page<M> findAll(Specification<M> specification, Pageable pageable) {
    Page<M> page = this.baseRepository.findAll(specification, pageable);
    return page;
  }
  
  public List<M> findAll(Specification<M> specification, Sort sort) {
    List<M> result = this.baseRepository.findAll(specification, sort);
    return result;
  }
  
  protected <S extends M> void preProcessSave(S entity) {
    preProcessUpdateAction(entity);
  }
  
  protected <S extends M> void preProcessUpdate(S entity, S entityInDb) {
    preProcessUpdateAction(entity);
  }
  
  protected <S extends M> void preProcessDelete(S entity) {
    preProcessUpdateAction(entity);
  }
  
  protected <S extends M> void preProcessUpdateAction(S entity) {}
  
  protected <S extends M> void preProcessAction() {}
}
