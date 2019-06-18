package de.uniks.webengineering2019.bla.de.uniks.webengineering2019.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import java.util.Date;
import java.util.List;

@Setter
@Getter
@AllArgsConstructor
@Builder
@Entity
@Table(catalog="bucketlist")
public class BucketList{

    @Id
    @GeneratedValue
    @JsonProperty(access = JsonProperty.Access.READ_ONLY) // See JavaDoc for explanation.
    private Long id;
    private String title;

    //private List<BucketListEntry> entries;
    private int numEntries;

    private Date createnDate;
    private Date lastUpdated;

    public BucketList(){

    }
}
