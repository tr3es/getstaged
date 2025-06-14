package com.getstaged.repository;

import com.getstaged.domain.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

    Student findStudentById(Long id);

    List<Student> getAllByMonitorId(Long id);
}
