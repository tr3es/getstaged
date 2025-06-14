package com.getstaged.util;

import com.getstaged.domain.Offer;
import com.getstaged.exception.BadRequestException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

public final class ServiceHelpers {

    public static void validatePageNumberAndSize(int page, int size) {
        if(page < 0) {
            throw new BadRequestException("Page number cannot be less than zero.");
        }

        if(size > Constants.MAX_PAGE_SIZE) {
            throw new BadRequestException("Page size must not be greater than " + Constants.MAX_PAGE_SIZE);
        }
    }

    public static Page<Offer> getOffersPageable(String sortProprety, int page, int size, JpaRepository jpaRepository){
        ServiceHelpers.validatePageNumberAndSize(page, size);
        Pageable pageable = PageRequest.of(page, size, Sort.Direction.DESC, sortProprety);
        return jpaRepository.findAll(pageable);
    }
}
