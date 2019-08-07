package de.uniks.webengineering2019.bla.utils;

import lombok.*;

import java.util.List;

@AllArgsConstructor
@Getter
@Setter
@NoArgsConstructor
@Builder
public class PageSupport<T extends Object> {
    public List<T> content;
    public int lastingElements;
}
