package de.uniks.webengineering2019.bla.utils;

import lombok.*;
import org.springframework.data.domain.Page;

import java.util.List;

@AllArgsConstructor
@Getter
@Setter
@NoArgsConstructor
@Builder
public class PageSupport<T extends Object> {
    public List<T> content;
    public int lastingElements;

    public PageSupport(Page pageResult,int currentPage,int numOnPage){
        lastingElements = (int)pageResult.getTotalElements() - (currentPage+1) * numOnPage;
        if(lastingElements < 0){
            lastingElements = 0;
        }
        content = pageResult.getContent();
    }
}
