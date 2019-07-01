package de.uniks.webengineering2019.bla.de.uniks.webengineering2019.model;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIdentityReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.Date;

/**
 * For now, I'd like to try to store a reference to the master topic, e.g. bucketlist or bucketlistentry so
 * that we can fetch all associated comments with one request.
 * additionally, i'll store a reference to the direct parent
 */
@Setter
@Getter
@Builder
@AllArgsConstructor
@Entity
public class Comment {

    @Id
    @GeneratedValue
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Long id;

    private Date created;

    @Column(length = 4096)
    private String comment;

    @ManyToOne
    @JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class)
    @JsonIdentityReference(alwaysAsId = true)
    private BucketListEntry master;

    @ManyToOne
    @JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class)
    private Comment parent;

    @PrePersist
    public void init() {
        if (created == null) {
            created = new Date();
        }
    }
}
