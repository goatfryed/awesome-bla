package de.uniks.webengineering2019.bla.de.uniks.webengineering2019.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import java.util.Date;

@Setter
@Getter
@Builder
@AllArgsConstructor
@Entity
public class BucketListEntry{

    @Id
    @GeneratedValue
    @JsonProperty(access = JsonProperty.Access.READ_ONLY) // See JavaDoc for explanation.
    private Long id;

    private String title;

    private Date created;
    private Date updated;
    private Date completed;

    public BucketListEntry()
    {

    }
}
