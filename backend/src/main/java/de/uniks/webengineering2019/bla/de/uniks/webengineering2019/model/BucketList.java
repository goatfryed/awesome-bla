package de.uniks.webengineering2019.bla.de.uniks.webengineering2019.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Setter
@Getter
@AllArgsConstructor
@Builder
public class BucketList{

    private int id;
    private String title;
    private List<BucketListEntry> entries;

    private Date createnDate;
    private Date lastUpdated;
}
