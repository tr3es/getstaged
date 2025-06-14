package com.getstaged.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.getstaged.domain.audit.AbstractAuditingEntity;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.Objects;

@Data
@Entity
@Table(name = "Notifications")
public class Notification /*extends AbstractAuditingEntity*/ {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "notification_id")
    private Long id;

    @NotNull
    private String title;

    @NotNull
    private String message;

    @Enumerated(EnumType.STRING)
    @NotNull
    @Column(length = 10)
    @Builder.Default
    private StatusNotification statusNotification = StatusNotification.INFO;

    @Builder.Default
    private boolean isChecked = false;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    private User user;

    public Notification() {
    }

    @Override
    public String toString() {
        return "Notification{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", message='" + message + '\'' +
                ", statusNotification=" + statusNotification +
                ", isChecked=" + isChecked +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Notification)) return false;
        if (!super.equals(o)) return false;
        Notification that = (Notification) o;
        return isChecked() == that.isChecked() &&
                Objects.equals(getId(), that.getId()) &&
                Objects.equals(getTitle(), that.getTitle()) &&
                Objects.equals(getMessage(), that.getMessage()) &&
                getStatusNotification() == that.getStatusNotification() &&
                Objects.equals(getUser(), that.getUser());
    }

    @Override
    public int hashCode() {
        return Objects.hash(super.hashCode(),
                getId(),
                getTitle(),
                getMessage(),
                getStatusNotification(),
                isChecked(),
                getUser());
    }
}
